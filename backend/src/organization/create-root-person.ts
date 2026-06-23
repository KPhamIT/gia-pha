import type { Prisma } from '../../generated/prisma/client.js';

export const ROOT_PERSON_FULL_NAME = 'Thủy Tổ';

/** Bootstrap person for a new organization — ancestor node of the family tree. */
export async function createRootPersonForOrg(
  tx: Prisma.TransactionClient,
  organizationId: number,
) {
  return tx.person.create({
    data: {
      organizationId,
      fullName: ROOT_PERSON_FULL_NAME,
      gender: 'male',
      generation: 0,
      branch: 1,
    },
  });
}
