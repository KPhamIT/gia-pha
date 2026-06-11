import 'dotenv/config';
import { PrismaClient } from '../dist/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? '',
  }),
});

async function main() {
  console.log('Starting seed...');

  let organization = await prisma.organization.findFirst({
    where: {
      name: 'Họ Phạm',
    },
  });

  if (!organization) {
    organization = await prisma.organization.create({
      data: {
        name: 'Họ Phạm',
      },
    });

    console.log('Created organization:', organization.name);
  }

  const existingRoot = await prisma.person.findFirst({
    where: {
      organizationId: organization.id,
      fullName: 'Thủy Tổ',
    },
  });

  if (!existingRoot) {
    const rootPerson = await prisma.person.create({
      data: {
        organizationId: organization.id,
        fullName: 'Thủy Tổ',
        gender: 'male',
        generation: 1,
        branch: 1,
      },
    });

    console.log('Created root person:', rootPerson.fullName);
  } else {
    console.log('Root person already exists');
  }

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });