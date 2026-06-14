import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
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
  private summarize(
    amountPerPerson: number,
    contributions: { paid: boolean }[],
    donations: { amount: number }[],
  ) {
    const paidCount = contributions.filter((c) => c.paid).length;
    const totalCollected = paidCount * amountPerPerson;
    const donationTotal = donations.reduce((sum, d) => sum + d.amount, 0);
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
        contributions: { select: { paid: true } },
        donations: { select: { amount: true } },
      },
    });
    const { contributions, donations, ...rest } = event;
    return { ...rest, ...this.summarize(rest.amountPerPerson, contributions, donations) };
  }

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
      include: {
        contributions: { select: { paid: true } },
        donations: { select: { amount: true } },
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
        contributions: { select: { personId: true, paid: true } },
        donations: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    return {
      ...event,
      ...this.summarize(event.amountPerPerson, event.contributions, event.donations),
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

  /** Mark a person as paid (create row) or unpaid (remove row) for an event. */
  async setContribution(eventId: number, personId: number, paid: boolean) {
    await this.ensureExists(eventId);

    if (paid) {
      await this.prisma.eventContribution.upsert({
        where: { eventId_personId: { eventId, personId } },
        create: { eventId, personId, paid: true },
        update: { paid: true },
      });
    } else {
      await this.prisma.eventContribution.deleteMany({
        where: { eventId, personId },
      });
    }

    return this.findOne(eventId);
  }

  async addDonation(eventId: number, dto: CreateDonationDto) {
    await this.ensureExists(eventId);
    await this.prisma.eventDonation.create({
      data: {
        eventId,
        personId: dto.personId ?? null,
        donorName: dto.donorName,
        amount: dto.amount ?? 0,
        note: dto.note,
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
      data: {
        personId: dto.personId,
        donorName: dto.donorName,
        amount: dto.amount,
        note: dto.note,
      },
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

  private async ensureExists(id: number) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
  }
}
