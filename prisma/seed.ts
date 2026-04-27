// =============================================================
// DALVA — Database Seed
// Popula o banco com dados iniciais para o escritório
// =============================================================

import { PrismaClient, Role, LeadStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // ── 1. Criar a Organização (Escritório) ──
  const org = await prisma.organization.upsert({
    where: { id: 'org_amorim_rodrigues' },
    update: {},
    create: {
      id: 'org_amorim_rodrigues',
      name: 'Amorim Rodrigues Advogados',
      documentId: '00.000.000/0001-00', // CNPJ placeholder
      subscriptionStatus: 'active',
    },
  });
  console.log(`✅ Organização criada: ${org.name}`);

  // ── 2. Criar o Admin (Dr. Amorim) ──
  const adminHash = await hash('Dalva@AR2026!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'dr.amorim@escritorio.com' },
    update: {},
    create: {
      name: 'Dr. Amorim',
      email: 'dr.amorim@escritorio.com',
      passwordHash: adminHash,
      role: Role.SUPER_ADMIN,
      organizationId: org.id,
    },
  });
  console.log(`✅ Admin criado: ${admin.name} (${admin.email})`);

  // ── 3. Criar Leads de Exemplo ──
  const leadsData = [
    {
      name: 'Maria Eduarda Santos',
      phone: '(11) 99123-4567',
      niche: 'Trabalhista',
      status: LeadStatus.QUALIFICADO,
      score: 87,
      aiSummary: 'Demitida sem justa causa após 5 anos. Não recebeu FGTS. Boa viabilidade.',
    },
    {
      name: 'Carlos Roberto Lima',
      phone: '(21) 98765-4321',
      niche: 'Previdenciário',
      status: LeadStatus.EM_ATENDIMENTO,
      score: 92,
      aiSummary: 'Aposentadoria por tempo de contribuição negada. CNIS com lacunas. Alta viabilidade.',
    },
    {
      name: 'Ana Paula Ferreira',
      phone: '(31) 97654-3210',
      niche: 'Consumidor',
      status: LeadStatus.NOVO,
      score: 65,
      aiSummary: 'Cobrança indevida no cartão. Dano moral configurado. Viabilidade média.',
    },
    {
      name: 'João Mendes Costa',
      phone: '(41) 96543-2109',
      niche: 'Trabalhista',
      status: LeadStatus.CONTRATO_ENVIADO,
      score: 78,
      aiSummary: 'Horas extras não pagas nos últimos 3 anos. Documentação completa.',
    },
    {
      name: 'Fernanda Oliveira',
      phone: '(51) 95432-1098',
      niche: 'Previdenciário',
      status: LeadStatus.FECHADO,
      score: 95,
      aiSummary: 'BPC/LOAS negado. Renda familiar dentro do critério. Alta viabilidade.',
    },
  ];

  for (const lead of leadsData) {
    await prisma.lead.create({
      data: {
        ...lead,
        organizationId: org.id,
      },
    });
  }
  console.log(`✅ ${leadsData.length} leads criados`);

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('━'.repeat(50));
  console.log('📧 Email:  dr.amorim@escritorio.com');
  console.log('🔑 Senha:  Dalva@AR2026!');
  console.log('━'.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
