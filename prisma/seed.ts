import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.create({
    data: {
      name: 'Amorim Rodrigues Advogados',
      documentId: '12345678000190',
    },
  });

  const passwordHash = await hash('Dalva@AR2026!', 10);
  
  await prisma.user.create({
    data: {
      name: 'Dr. Amorim',
      email: 'dr.amorim@escritorio.com',
      passwordHash: passwordHash,
      role: 'TENANT_ADMIN',
      organizationId: org.id,
    },
  });

  console.log('✓ Seed criado');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());