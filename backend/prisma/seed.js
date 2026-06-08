import 'dotenv/config';
import { PrismaClient } from '../dist/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? '',
  }),
});

const organizationName = 'Family Tree Seed Organization';
const seedPersons = Array.from({ length: 20 }, (_, index) => ({
  fullName: `Seed Person ${index + 1}`,
  gender: ['male', 'female', 'other'][index % 3],
  birthDate: new Date(1980 + (index % 30), index % 12, 1 + (index % 28)),
  avatar: `https://api.dicebear.com/6.x/identicon/svg?seed=family-tree-seed-${index + 1}`,
}));

async function main() {
  console.log('Starting seed script...');

  const organization =
    (await prisma.organization.findFirst({ where: { name: organizationName } })) ||
    (await prisma.organization.create({ data: { name: organizationName } }));

  const created = [];

  for (const person of seedPersons) {
    const existing = await prisma.person.findFirst({
      where: {
        fullName: person.fullName,
        organizationId: organization.id,
      },
    });

    if (existing) {
      console.log(`Skipped existing person: ${person.fullName}`);
      created.push(existing);
      continue;
    }

    const createdPerson = await prisma.person.create({
      data: {
        organizationId: organization.id,
        ...person,
      },
    });

    created.push(createdPerson);
    console.log(`Created person: ${createdPerson.fullName}`);
  }

  // Tạo quan hệ gia đình: mô phỏng cây gia phả
  const relationships = [];

  if (created.length >= 6) {
    // Person 1 & 2 là cặp vợ chồng (ông bà)
    relationships.push(
      { fromId: created[0].id, toId: created[1].id, type: 'SPOUSE' },
      { fromId: created[1].id, toId: created[0].id, type: 'SPOUSE' },
    );

    // Person 3 & 4 là con của Person 1 & 2
    relationships.push(
      { fromId: created[0].id, toId: created[2].id, type: 'CHILD' },
      { fromId: created[1].id, toId: created[2].id, type: 'CHILD' },
      { fromId: created[2].id, toId: created[0].id, type: 'FATHER' },
      { fromId: created[2].id, toId: created[1].id, type: 'MOTHER' },
    );

    // Person 4 là con của Person 1 & 2
    relationships.push(
      { fromId: created[0].id, toId: created[3].id, type: 'CHILD' },
      { fromId: created[1].id, toId: created[3].id, type: 'CHILD' },
      { fromId: created[3].id, toId: created[0].id, type: 'FATHER' },
      { fromId: created[3].id, toId: created[1].id, type: 'MOTHER' },
    );

    // Person 3 & 4 là cặp vợ chồng
    relationships.push(
      { fromId: created[2].id, toId: created[3].id, type: 'SPOUSE' },
      { fromId: created[3].id, toId: created[2].id, type: 'SPOUSE' },
    );

    // Person 5 & 6 là con của Person 3 & 4
    relationships.push(
      { fromId: created[2].id, toId: created[4].id, type: 'CHILD' },
      { fromId: created[3].id, toId: created[4].id, type: 'CHILD' },
      { fromId: created[4].id, toId: created[2].id, type: 'FATHER' },
      { fromId: created[4].id, toId: created[3].id, type: 'MOTHER' },
    );

    if (created.length >= 7) {
      relationships.push(
        { fromId: created[2].id, toId: created[5].id, type: 'CHILD' },
        { fromId: created[3].id, toId: created[5].id, type: 'CHILD' },
        { fromId: created[5].id, toId: created[2].id, type: 'FATHER' },
        { fromId: created[5].id, toId: created[3].id, type: 'MOTHER' },
      );
    }

    // Person 7 & 8 là con của Person 1 & 2 (ứng với loại giới tính khác)
    if (created.length >= 9) {
      relationships.push(
        { fromId: created[0].id, toId: created[6].id, type: 'CHILD' },
        { fromId: created[1].id, toId: created[6].id, type: 'CHILD' },
        { fromId: created[6].id, toId: created[0].id, type: 'FATHER' },
        { fromId: created[6].id, toId: created[1].id, type: 'MOTHER' },
        { fromId: created[0].id, toId: created[7].id, type: 'CHILD' },
        { fromId: created[1].id, toId: created[7].id, type: 'CHILD' },
        { fromId: created[7].id, toId: created[0].id, type: 'FATHER' },
        { fromId: created[7].id, toId: created[1].id, type: 'MOTHER' },
      );

      // Person 7 & 8 là cặp vợ chồng
      relationships.push(
        { fromId: created[6].id, toId: created[7].id, type: 'SPOUSE' },
        { fromId: created[7].id, toId: created[6].id, type: 'SPOUSE' },
      );
    }
  }

  // Lưu tất cả quan hệ
  for (const rel of relationships) {
    const existing = await prisma.relationship.findFirst({
      where: { fromId: rel.fromId, toId: rel.toId, type: rel.type },
    });

    if (!existing) {
      await prisma.relationship.create({ data: rel });
      console.log(`Created relationship: ${created.find((p) => p.id === rel.fromId)?.fullName} -> ${created.find((p) => p.id === rel.toId)?.fullName} (${rel.type})`);
    }
  }

  console.log(`Seed complete. Created ${created.length} person(s) and ${relationships.length} relationship(s).`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
