import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.create({
    data: { name: 'Amorim Rodrigues Advogados', documentId: '12345678000190' },
  });

  const passwordHash = await hash('Dalva@AR2026!', 10);

  await prisma.user.create({
    data: {
      name: 'Dr. Amorim',
      email: 'dr.amorim@escritorio.com',
      passwordHash,
      role: 'admin',
      organizationId: org.id,
    },
  });

  // Leads de demonstração com mensagens
  const lead1 = await prisma.lead.create({
    data: {
      name: 'Maria Eduarda Silva',
      phone: '11987654321',
      email: 'maria.silva@email.com',
      niche: 'consumidor',
      status: 'qualificando',
      score: 8,
      aiSummary: 'Cobrança indevida de R$ 3.200 no cartão. Tem BO e protocolos do banco.',
      lastMessage: 'Sim, tenho todos os comprovantes aqui comigo.',
      organizationId: org.id,
    },
  });

  await prisma.message.createMany({
    data: [
      { leadId: lead1.id, sender: 'lead', content: 'Olá, boa noite! Vi o anúncio de vocês. Preciso de ajuda com direito do consumidor.' },
      { leadId: lead1.id, sender: 'ia', content: 'Olá, Maria! 😊 Sou a Dalva, assistente do escritório Amorim Rodrigues Advogados. Pode me contar o que aconteceu?' },
      { leadId: lead1.id, sender: 'lead', content: 'Apareceu uma cobrança de R$ 3.200 no meu cartão que eu não fiz. O banco se recusa a estornar.' },
      { leadId: lead1.id, sender: 'ia', content: 'Entendo, Maria. O Código de Defesa do Consumidor protege você nesse caso. Você tem algum comprovante ou protocolo do banco?' },
      { leadId: lead1.id, sender: 'lead', content: 'Sim, tenho todos os comprovantes aqui comigo.' },
    ],
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: 'Carlos Roberto Oliveira',
      phone: '31965432109',
      niche: 'trabalhista',
      status: 'novo',
      score: 7,
      aiSummary: 'Demitido sem justa causa após 8 anos. Verbas rescisórias incompletas.',
      lastMessage: 'Boa noite, preciso de ajuda com uma demissão injusta.',
      organizationId: org.id,
    },
  });

  await prisma.message.createMany({
    data: [
      { leadId: lead2.id, sender: 'lead', content: 'Boa noite, preciso de ajuda com uma demissão injusta.' },
      { leadId: lead2.id, sender: 'ia', content: 'Boa noite, Carlos! Sou a Dalva. Lamento pela situação. Pode me contar mais detalhes?' },
    ],
  });

  const lead3 = await prisma.lead.create({
    data: {
      name: 'José Antônio Pereira',
      phone: '51943210987',
      niche: 'previdenciario',
      status: 'qualificando',
      score: 8,
      aiSummary: 'Aposentadoria negada pelo INSS. 35 anos de contribuição comprovados.',
      lastMessage: 'Tenho a carta de indeferimento do INSS aqui.',
      organizationId: org.id,
    },
  });

  await prisma.message.createMany({
    data: [
      { leadId: lead3.id, sender: 'lead', content: 'Boa tarde. O INSS negou minha aposentadoria e eu já tenho tempo suficiente de contribuição.' },
      { leadId: lead3.id, sender: 'ia', content: 'Boa tarde, José! Sou a Dalva. Essa situação é comum com o INSS. Quantos anos de contribuição você tem?' },
      { leadId: lead3.id, sender: 'lead', content: 'Tenho 35 anos e 57 anos de idade.' },
      { leadId: lead3.id, sender: 'ia', content: 'Com 35 anos de contribuição seu caso parece viável para recurso. Você tem a carta de indeferimento?' },
      { leadId: lead3.id, sender: 'lead', content: 'Tenho a carta de indeferimento do INSS aqui.' },
    ],
  });

  console.log('✓ Seed criado com sucesso');
  console.log('✓ Login: dr.amorim@escritorio.com / Dalva@AR2026!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
