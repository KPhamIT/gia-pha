import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import {
  CreateDonationDto,
  DonationKindDto,
} from './dto/create-donation.dto.js';
import { UpdateDonationDto } from './dto/update-donation.dto.js';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  private async getDefaultOrganization() {
    const defaultName = 'Family Tree';
    const existing = await this.prisma.organization.findFirst({
      where: { name: defaultName },
    });
    if (existing) return existing;
    return this.prisma.organization.create({ data: { name: defaultName } });
  }

  /** Derived money/count stats shared by the list + detail responses. */
  private contributionAmount(
    contribution: { paid: boolean; amountPaid: number },
    amountPerPerson: number,
  ) {
    if (contribution.amountPaid > 0) return contribution.amountPaid;
    return contribution.paid && amountPerPerson > 0 ? amountPerPerson : 0;
  }

  private isFullyPaid(
    contribution: { paid: boolean; amountPaid: number },
    amountPerPerson: number,
  ) {
    if (amountPerPerson <= 0) return contribution.paid;
    return (
      contribution.amountPaid >= amountPerPerson ||
      (contribution.amountPaid === 0 && contribution.paid)
    );
  }

  private summarize(
    amountPerPerson: number,
    contributions: { paid: boolean; amountPaid: number }[],
    donations: { amount: number; kind?: string }[],
  ) {
    const paidCount = contributions.filter((c) =>
      this.isFullyPaid(c, amountPerPerson),
    ).length;
    const totalCollected = contributions.reduce(
      (sum, c) => sum + this.contributionAmount(c, amountPerPerson),
      0,
    );
    const donationTotal = donations
      .filter((d) => (d.kind ?? 'MONEY') === 'MONEY')
      .reduce((sum, d) => sum + d.amount, 0);
    return {
      paidCount,
      totalCollected,
      donationTotal,
      grandTotal: totalCollected + donationTotal,
    };
  }

  async create(dto: CreateEventDto) {
    const organization = dto.organizationId
      ? await this.prisma.organization.findUnique({
          where: { id: dto.organizationId },
        })
      : await this.getDefaultOrganization();

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type ?? 'INFO',
        eventDate: dto.eventDate ? new Date(dto.eventDate) : undefined,
        amountPerPerson: dto.amountPerPerson ?? 0,
        maleOnly: dto.maleOnly ?? false,
        organizationId:
          organization?.id ?? (await this.getDefaultOrganization()).id,
      },
      include: {
        contributions: { select: { paid: true, amountPaid: true } },
        donations: { select: { amount: true, kind: true } },
      },
    });
    const { contributions, donations, ...rest } = event;
    return {
      ...rest,
      ...this.summarize(rest.amountPerPerson, contributions, donations),
    };
  }

  async findAll() {
    return this.findEvents();
  }

  private async findEvents(organizationId?: number) {
    const events = await this.prisma.event.findMany({
      where: organizationId != null ? { organizationId } : undefined,
      orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
      include: {
        contributions: { select: { paid: true, amountPaid: true } },
        donations: { select: { amount: true, kind: true } },
      },
    });
    return events.map(({ contributions, donations, ...rest }) => ({
      ...rest,
      ...this.summarize(rest.amountPerPerson, contributions, donations),
    }));
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        contributions: {
          select: { personId: true, paid: true, amountPaid: true },
        },
        donations: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    return {
      ...event,
      ...this.summarize(
        event.amountPerPerson,
        event.contributions,
        event.donations,
      ),
    };
  }

  async update(id: number, dto: UpdateEventDto) {
    await this.ensureExists(id);
    await this.prisma.event.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        eventDate:
          dto.eventDate === undefined
            ? undefined
            : dto.eventDate
              ? new Date(dto.eventDate)
              : null,
        amountPerPerson: dto.amountPerPerson,
        maleOnly: dto.maleOnly,
      },
    });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.ensureExists(id);
    await this.prisma.event.delete({ where: { id } });
    return { id };
  }

  /** Apply many contribution updates in one transaction. amountPaid 0 removes the row. */
  async setContributions(
    eventId: number,
    items: { personId: number; amountPaid: number }[],
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Event not found');

    await this.prisma.$transaction(async (tx) => {
      for (const { personId, amountPaid } of items) {
        if (amountPaid <= 0) {
          await tx.eventContribution.deleteMany({
            where: { eventId, personId },
          });
        } else {
          const paid =
            event.amountPerPerson > 0 && amountPaid >= event.amountPerPerson;
          await tx.eventContribution.upsert({
            where: { eventId_personId: { eventId, personId } },
            create: { eventId, personId, amountPaid, paid },
            update: { amountPaid, paid },
          });
        }
      }
    });

    return this.findOne(eventId);
  }

  /** Apply create / update / delete donation changes in one transaction. */
  async setDonations(
    eventId: number,
    dto: {
      create: CreateDonationDto[];
      update: (UpdateDonationDto & { id: number })[];
      remove: number[];
    },
  ) {
    await this.ensureExists(eventId);

    await this.prisma.$transaction(async (tx) => {
      for (const id of dto.remove) {
        await tx.eventDonation.deleteMany({ where: { id, eventId } });
      }

      for (const entry of dto.update) {
        const { id, ...data } = entry;
        const donation = await tx.eventDonation.findFirst({
          where: { id, eventId },
        });
        if (!donation) throw new NotFoundException('Donation not found');

        await tx.eventDonation.update({
          where: { id },
          data: this.normalizeDonationFields(
            this.mergeDonationUpdate(donation, data),
          ),
        });
      }

      for (const item of dto.create) {
        await tx.eventDonation.create({
          data: {
            eventId,
            ...this.normalizeDonationFields(item),
          },
        });
      }
    });

    return this.findOne(eventId);
  }

  async addDonation(eventId: number, dto: CreateDonationDto) {
    await this.ensureExists(eventId);
    await this.prisma.eventDonation.create({
      data: {
        eventId,
        ...this.normalizeDonationFields(dto),
      },
    });
    return this.findOne(eventId);
  }

  async updateDonation(
    eventId: number,
    donationId: number,
    dto: UpdateDonationDto,
  ) {
    const donation = await this.prisma.eventDonation.findFirst({
      where: { id: donationId, eventId },
    });
    if (!donation) throw new NotFoundException('Donation not found');

    await this.prisma.eventDonation.update({
      where: { id: donationId },
      data: this.donationUpdateData(dto),
    });
    return this.findOne(eventId);
  }

  async removeDonation(eventId: number, donationId: number) {
    const donation = await this.prisma.eventDonation.findFirst({
      where: { id: donationId, eventId },
    });
    if (!donation) throw new NotFoundException('Donation not found');

    await this.prisma.eventDonation.delete({ where: { id: donationId } });
    return this.findOne(eventId);
  }

  private mergeDonationUpdate(
    existing: {
      donorName: string;
      personId: number | null;
      kind: CreateDonationDto['kind'] | string;
      amount: number;
      itemDescription: string | null;
      note: string | null;
    },
    patch: UpdateDonationDto,
  ): CreateDonationDto {
    return {
      donorName: patch.donorName ?? existing.donorName,
      personId: patch.personId ?? existing.personId ?? undefined,
      kind: (patch.kind ?? existing.kind) as CreateDonationDto['kind'],
      amount: patch.amount ?? existing.amount,
      itemDescription:
        patch.itemDescription ?? existing.itemDescription ?? undefined,
      note: patch.note ?? existing.note ?? undefined,
    };
  }

  private normalizeDonationFields(
    dto: CreateDonationDto,
  ): Omit<Prisma.EventDonationUncheckedCreateInput, 'eventId'> {
    const kind = dto.kind ?? DonationKindDto.MONEY;
    return {
      personId: dto.personId ?? null,
      donorName: dto.donorName,
      kind,
      amount: kind === DonationKindDto.IN_KIND ? 0 : (dto.amount ?? 0),
      itemDescription:
        kind === DonationKindDto.IN_KIND ? (dto.itemDescription ?? null) : null,
      note: dto.note ?? null,
    };
  }

  private donationUpdateData(
    dto: UpdateDonationDto,
  ): Prisma.EventDonationUncheckedUpdateInput {
    const kind = dto.kind ?? DonationKindDto.MONEY;
    const data: Prisma.EventDonationUncheckedUpdateInput = {};

    if (dto.personId !== undefined) {
      data.personId = dto.personId ?? null;
    }
    if (dto.donorName !== undefined) {
      data.donorName = dto.donorName;
    }
    if (dto.note !== undefined) {
      data.note = dto.note ?? null;
    }
    if (
      dto.kind !== undefined ||
      dto.amount !== undefined ||
      dto.itemDescription !== undefined
    ) {
      data.kind = kind;
      data.amount = kind === DonationKindDto.IN_KIND ? 0 : (dto.amount ?? 0);
      data.itemDescription =
        kind === DonationKindDto.IN_KIND ? (dto.itemDescription ?? null) : null;
    }

    return data;
  }

  private async ensureExists(id: number) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
  }
}
