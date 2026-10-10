import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRole, type User } from '../../../generated/prisma/client.js';
import { assertOrgMemberAccess } from '../../auth/org-access.js';
import { OrganizationService } from '../../organization/organization.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  planImport,
  readPersonRows,
  type ImportIssue,
  type ImportPlan,
  type PersonFields,
} from './person-excel.planner.js';
import { buildPersonWorkbook } from './person-excel.workbook.js';

const MAX_ISSUES = 200;
const CREATE_CHUNK = 200;

export type PersonImportResult = {
  applied: boolean;
  summary: ImportPlan['summary'];
  errors: ImportIssue[];
  warnings: ImportIssue[];
  /** Tổng số lỗi/cảnh báo (danh sách trả về bị cắt tối đa MAX_ISSUES). */
  errorCount: number;
  warningCount: number;
};

@Injectable()
export class PersonExcelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly organizationService: OrganizationService,
  ) {}

  async exportWorkbook(
    user: User,
    requestedOrgId: number | undefined,
    blank: boolean,
  ) {
    const organizationId = await this.resolveOrganizationId(
      user,
      requestedOrgId,
    );
    const snapshot = blank
      ? { persons: [], relationships: [] }
      : await this.loadSnapshot(organizationId);
    const buffer = await buildPersonWorkbook(
      snapshot.persons,
      snapshot.relationships,
    );
    return { buffer, organizationId };
  }

  async importWorkbook(
    user: User,
    buffer: Buffer,
    requestedOrgId: number | undefined,
    dryRun: boolean,
  ): Promise<PersonImportResult> {
    const organizationId = await this.resolveOrganizationId(
      user,
      requestedOrgId,
    );
    const { rows, errors: readErrors } = await readPersonRows(buffer);
    const snapshot = await this.loadSnapshot(organizationId);
    const plan = planImport(rows, snapshot);
    plan.errors.unshift(...readErrors);
    if (rows.length === 0 && readErrors.length === 0) {
      plan.errors.push({ row: 0, message: 'File không có dòng dữ liệu nào.' });
    }

    const canApply = !dryRun && plan.errors.length === 0;
    if (canApply) {
      await this.applyPlan(plan, organizationId, user.id);
    }
    return {
      applied: canApply,
      summary: plan.summary,
      errors: plan.errors.slice(0, MAX_ISSUES),
      warnings: plan.warnings.slice(0, MAX_ISSUES),
      errorCount: plan.errors.length,
      warningCount: plan.warnings.length,
    };
  }

  private async resolveOrganizationId(user: User, requestedOrgId?: number) {
    if (user.role === UserRole.STANDARD && user.organizationId == null) {
      throw new ForbiddenException('No organization');
    }
    const organizationId =
      await this.organizationService.resolveDefaultOrganizationId(
        user,
        requestedOrgId,
      );
    assertOrgMemberAccess(user, organizationId);
    return organizationId;
  }

  private async loadSnapshot(organizationId: number) {
    const [persons, relationships] = await Promise.all([
      this.prisma.person.findMany({
        where: { organizationId },
        include: {
          biography: { select: { content: true } },
          graveInfo: { select: { cemetery: true, address: true } },
        },
      }),
      this.prisma.relationship.findMany({
        where: {
          from: { organizationId },
          to: { organizationId },
        },
        select: { id: true, fromId: true, toId: true, type: true },
      }),
    ]);
    return { persons, relationships };
  }

  private async applyPlan(
    plan: ImportPlan,
    organizationId: number,
    userId: number,
  ) {
    await this.prisma.$transaction(
      async (tx) => {
        // 1. Tạo người mới (giữ thứ tự để map mã → id).
        const newIds = new Map<number, number>();
        for (let i = 0; i < plan.createRows.length; i += CREATE_CHUNK) {
          const chunk = plan.createRows.slice(i, i + CREATE_CHUNK);
          const created = await tx.person.createManyAndReturn({
            data: chunk.map((rowIndex) => ({
              ...(plan.rows[rowIndex].fields as Required<
                Pick<PersonFields, 'fullName'>
              > &
                PersonFields),
              organizationId,
              lastEditedByUserId: userId,
            })),
            select: { id: true },
          });
          chunk.forEach((rowIndex, j) => newIds.set(rowIndex, created[j].id));
        }

        const idOf = (
          ref:
            | { kind: 'existing'; id: number }
            | { kind: 'new'; index: number },
        ) => (ref.kind === 'existing' ? ref.id : newIds.get(ref.index)!);

        // 2. Cập nhật người đã có.
        for (const rowIndex of plan.updateRows) {
          const row = plan.rows[rowIndex];
          const id = row.existingId!;
          if (Object.keys(row.fields).length > 0) {
            await tx.person.update({ where: { id }, data: row.fields });
          }
        }

        // 3. Tiểu sử và mộ phần (cả người mới lẫn người cũ).
        for (const [rowIndex, row] of plan.rows.entries()) {
          const id = row.existingId ?? newIds.get(rowIndex);
          if (id == null) continue;
          if (row.biography != null) {
            await tx.biography.upsert({
              where: { personId: id },
              create: { personId: id, content: row.biography },
              update: { content: row.biography },
            });
          }
          if (row.clearGrave) {
            await tx.graveInfo.deleteMany({ where: { personId: id } });
          } else if (row.grave) {
            const data = Object.fromEntries(
              Object.entries(row.grave).filter(([, v]) => v != null),
            );
            await tx.graveInfo.upsert({
              where: { personId: id },
              create: { personId: id, ...data },
              update: data,
            });
          }
        }

        // 4. Quan hệ.
        const removeIds = plan.parentChanges.flatMap(
          (c) => c.removeRelationshipIds,
        );
        if (removeIds.length > 0) {
          await tx.relationship.deleteMany({
            where: { id: { in: removeIds } },
          });
        }
        const relationshipData = [
          ...plan.parentChanges.map((c) => ({
            fromId: idOf(c.parent),
            toId: idOf(c.child),
            type:
              c.role === 'father' ? ('FATHER' as const) : ('MOTHER' as const),
          })),
          ...plan.spousePairs.map(([a, b]) => ({
            fromId: idOf(a),
            toId: idOf(b),
            type: 'SPOUSE' as const,
          })),
        ];
        if (relationshipData.length > 0) {
          await tx.relationship.createMany({ data: relationshipData });
        }

        // 5. Nhật ký sửa.
        const touched = [
          ...newIds.values(),
          ...plan.updateRows.map((i) => plan.rows[i].existingId!),
        ];
        if (touched.length > 0) {
          await tx.personEditLog.createMany({
            data: touched.map((personId) => ({ personId, userId })),
          });
          await tx.person.updateMany({
            where: { id: { in: touched } },
            data: { lastEditedByUserId: userId },
          });
        }
      },
      { maxWait: 10_000, timeout: 120_000 },
    );
  }
}
