import type { Prisma } from '../../generated/prisma/client.js';

type EditorUser = {
  id: number;
  username: string | null;
  email: string | null;
};

export function formatPersonEditorName(user: EditorUser): string {
  return user.username?.trim() || user.email?.trim() || `User #${user.id}`;
}

type AuditTx = Pick<
  Prisma.TransactionClient,
  'personEditLog' | 'person'
>;

export async function recordPersonEdit(
  tx: AuditTx,
  personId: number,
  userId: number,
): Promise<void> {
  await tx.personEditLog.create({ data: { personId, userId } });
  await tx.person.update({
    where: { id: personId },
    data: { lastEditedByUserId: userId },
  });
}
