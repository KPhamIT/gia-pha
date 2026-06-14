import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';

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

  /** Adds derived contribution stats so the list can show paid count + total. */
  private withSummary<
    T extends { amountPerPerson: number; contributions: { paid: boolean }[] },
  >(event: T) {
    const paidCount = event.contributions.filter((c) => c.paid).length;
    const { contributions: _contributions, ...rest } = event;
    return {
      ...rest,
      paidCount,
      totalCollected: paidCount * event.amountPerPerson,
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
        organizationId:
          organization?.id ?? (await this.getDefaultOrganization()).id,
      },
      include: { contributions: { select: { paid: true } } },
    });
    return this.withSummary(event);
  }

  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: [{ eventDate: 'desc' }, { createdAt: 'desc' }],
      include: { contributions: { select: { paid: true } } },
    });
    return events.map((event) => this.withSummary(event));
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        contributions: { select: { personId: true, paid: true } },
      },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: number, dto: UpdateEventDto) {
    await this.ensureExists(id);
    const event = await this.prisma.event.update({
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
      },
      include: { contributions: { select: { paid: true } } },
    });
    return this.withSummary(event);
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

  private async ensureExists(id: number) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
  }
}
