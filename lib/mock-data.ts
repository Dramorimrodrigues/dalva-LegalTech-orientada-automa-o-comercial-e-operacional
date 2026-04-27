// =============================================================
// DALVA — Mock Data (Dados Simulados para MVP)
// Casos jurídicos realistas para demonstração
// =============================================================

import {
  Lead,
  Mensagem,
  Conversa,
  MetricasDashboard,
  LeadsPorNicho,
  DadosFunil,
  AtividadeRecente,
  PerformanceSemanal,
} from './types';

// ── Helper ──
function horasAtras(h: number): string {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d.toISOString();
}

function diasAtras(dias: number): string {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return d.toISOString();
}

// ── LEADS ──
export const mockLeads: Lead[] = [
  {
    id: 'lead-001',
    nome: 'Maria Eduarda Silva',
    telefone: '11987654321',
    email: 'maria.silva@email.com',
    nicho: 'consumidor',
    status: 'qualificando',
    score: 8,
    resumoCaso: 'Cobrança indevida de R$ 3.200 no cartão de crédito. Banco se recusa a estornar. Cliente possui todos os comprovantes.',
    criadoEm: horasAtras(2),
    atualizadoEm: horasAtras(0.5),
    ultimaMensagem: 'Sim, tenho todos os comprovantes aqui comigo.',
  },
  {
    id: 'lead-002',
    nome: 'João Carlos Santos',
    telefone: '21976543210',
    email: 'joao.santos@email.com',
    nicho: 'consumidor',
    status: 'qualificado',
    score: 9,
    resumoCaso: 'Comprou celular de R$ 5.500 com defeito de fábrica. Loja se recusou a trocar dentro do prazo de garantia.',
    criadoEm: horasAtras(8),
    atualizadoEm: horasAtras(3),
    ultimaMensagem: 'Quando posso assinar o contrato?',
  },
  {
    id: 'lead-003',
    nome: 'Carlos Roberto Oliveira',
    telefone: '31965432109',
    nicho: 'trabalhista',
    status: 'novo',
    score: 7,
    resumoCaso: 'Demitido sem justa causa após 8 anos. Empresa não pagou verbas rescisórias completas. Falta FGTS e multa.',
    criadoEm: horasAtras(0.5),
    atualizadoEm: horasAtras(0.5),
    ultimaMensagem: 'Boa noite, preciso de ajuda com uma demissão injusta.',
  },
  {
    id: 'lead-004',
    nome: 'Ana Beatriz Costa',
    telefone: '41954321098',
    email: 'ana.costa@email.com',
    nicho: 'trabalhista',
    status: 'contrato_enviado',
    score: 9,
    resumoCaso: 'Assédio moral sistemático no ambiente de trabalho. Superiora com comportamento abusivo documentado por 2 anos.',
    criadoEm: diasAtras(2),
    atualizadoEm: horasAtras(6),
    ultimaMensagem: 'Recebi o contrato, vou ler com calma e assinar.',
  },
  {
    id: 'lead-005',
    nome: 'José Antônio Pereira',
    telefone: '51943210987',
    email: 'jose.pereira@email.com',
    nicho: 'previdenciario',
    status: 'qualificando',
    score: 8,
    resumoCaso: 'Aposentadoria por tempo de contribuição negada pelo INSS. Tem 35 anos de contribuição comprovados com CNIS.',
    criadoEm: horasAtras(4),
    atualizadoEm: horasAtras(1),
    ultimaMensagem: 'Tenho a carta de indeferimento do INSS aqui.',
  },
  {
    id: 'lead-006',
    nome: 'Francisca Maria Lima',
    telefone: '61932109876',
    nicho: 'previdenciario',
    status: 'qualificado',
    score: 7,
    resumoCaso: 'Auxílio-doença indeferido pelo INSS mesmo com laudo médico comprovando incapacidade temporária.',
    criadoEm: diasAtras(1),
    atualizadoEm: horasAtras(5),
    ultimaMensagem: 'O médico do INSS nem me examinou direito...',
  },
  {
    id: 'lead-007',
    nome: 'Roberto Mendes Filho',
    telefone: '71921098765',
    nicho: 'consumidor',
    status: 'convertido',
    score: 10,
    resumoCaso: 'Negativado indevidamente por dívida já quitada. Score caiu de 800 para 200. Perdeu financiamento.',
    criadoEm: diasAtras(5),
    atualizadoEm: diasAtras(3),
    ultimaMensagem: 'Contrato assinado! Quando começa o processo?',
  },
  {
    id: 'lead-008',
    nome: 'Patrícia Souza Almeida',
    telefone: '81910987654',
    nicho: 'trabalhista',
    status: 'convertido',
    score: 9,
    resumoCaso: 'Trabalhou 3 anos sem registro em carteira. Empresa se recusa a reconhecer vínculo empregatício.',
    criadoEm: diasAtras(7),
    atualizadoEm: diasAtras(4),
    ultimaMensagem: 'Obrigada pela rapidez! Já assinei tudo.',
  },
  {
    id: 'lead-009',
    nome: 'Antônio Marcos Ferreira',
    telefone: '85909876543',
    nicho: 'previdenciario',
    status: 'descartado',
    score: 2,
    resumoCaso: 'Busca aposentadoria mas tem apenas 10 anos de contribuição e 45 anos de idade.',
    criadoEm: diasAtras(3),
    atualizadoEm: diasAtras(2),
    ultimaMensagem: 'Entendo, vou juntar mais tempo então.',
  },
  {
    id: 'lead-010',
    nome: 'Luciana Martins Rocha',
    telefone: '11998877665',
    nicho: 'consumidor',
    status: 'novo',
    score: 6,
    resumoCaso: 'Plano de saúde negou cirurgia recomendada pelo médico. Alega que procedimento não está no rol da ANS.',
    criadoEm: horasAtras(1),
    atualizadoEm: horasAtras(1),
    ultimaMensagem: 'Oi, vi o anúncio de vocês. Meu plano negou uma cirurgia.',
  },
  {
    id: 'lead-011',
    nome: 'Marcos Vinícius Araújo',
    telefone: '21987766554',
    nicho: 'trabalhista',
    status: 'qualificando',
    score: 6,
    resumoCaso: 'Horas extras não pagas nos últimos 2 anos. Tem registros de ponto que comprovam.',
    criadoEm: horasAtras(3),
    atualizadoEm: horasAtras(1.5),
    ultimaMensagem: 'Sim, tenho os holerites e os registros de ponto guardados.',
  },
  {
    id: 'lead-012',
    nome: 'Cláudia Regina Barbosa',
    telefone: '31976655443',
    email: 'claudia.barbosa@email.com',
    nicho: 'previdenciario',
    status: 'contrato_enviado',
    score: 8,
    resumoCaso: 'BPC/LOAS negado. Mãe de criança com deficiência. Renda familiar per capita dentro do limite.',
    criadoEm: diasAtras(1),
    atualizadoEm: horasAtras(8),
    ultimaMensagem: 'Vou imprimir e assinar hoje mesmo.',
  },
];

// ── MENSAGENS (Conversas simuladas) ──
export const mockMensagens: Record<string, Mensagem[]> = {
  'lead-001': [
    {
      id: 'msg-001-1',
      leadId: 'lead-001',
      remetente: 'lead',
      conteudo: 'Olá, boa noite! Vi o anúncio de vocês sobre direito do consumidor. Preciso de ajuda.',
      timestamp: horasAtras(2),
    },
    {
      id: 'msg-001-2',
      leadId: 'lead-001',
      remetente: 'ia',
      conteudo: 'Olá, Maria! 😊 Bem-vinda ao escritório Amorim Rodrigues Advogados. Sou a assistente virtual Dalva e estou aqui para ajudá-la. Pode me contar o que aconteceu?',
      timestamp: horasAtras(2),
    },
    {
      id: 'msg-001-3',
      leadId: 'lead-001',
      remetente: 'lead',
      conteudo: 'Apareceu uma cobrança de R$ 3.200 no meu cartão de crédito que eu não fiz. Já liguei pro banco mas eles dizem que não podem estornar.',
      timestamp: horasAtras(1.9),
    },
    {
      id: 'msg-001-4',
      leadId: 'lead-001',
      remetente: 'ia',
      conteudo: 'Entendo, Maria. Isso é muito comum e o Código de Defesa do Consumidor protege você nesse caso. Preciso de algumas informações para avaliar seu caso:\n\n1️⃣ Quando essa cobrança apareceu?\n2️⃣ Você já fez um boletim de ocorrência?\n3️⃣ Tem algum protocolo do atendimento com o banco?',
      timestamp: horasAtras(1.9),
    },
    {
      id: 'msg-001-5',
      leadId: 'lead-001',
      remetente: 'lead',
      conteudo: 'Apareceu mês passado. Sim, fiz o BO e tenho 3 protocolos do banco. Eles ficam enrolando!',
      timestamp: horasAtras(1.5),
    },
    {
      id: 'msg-001-6',
      leadId: 'lead-001',
      remetente: 'ia',
      conteudo: 'Excelente, Maria! O fato de você ter o BO e os protocolos fortalece muito o seu caso. Geralmente nesses casos o consumidor tem direito a:\n\n✅ Devolução do valor cobrado em dobro\n✅ Possível indenização por danos morais\n\nVocê tem os comprovantes em mãos? Se sim, nosso advogado especialista pode analisar e apresentar uma proposta de honorários para o seu caso.',
      timestamp: horasAtras(1.4),
    },
    {
      id: 'msg-001-7',
      leadId: 'lead-001',
      remetente: 'lead',
      conteudo: 'Sim, tenho todos os comprovantes aqui comigo.',
      timestamp: horasAtras(0.5),
    },
  ],
  'lead-003': [
    {
      id: 'msg-003-1',
      leadId: 'lead-003',
      remetente: 'lead',
      conteudo: 'Boa noite, preciso de ajuda com uma demissão injusta.',
      timestamp: horasAtras(0.5),
    },
    {
      id: 'msg-003-2',
      leadId: 'lead-003',
      remetente: 'ia',
      conteudo: 'Boa noite, Carlos! Sou a Dalva, assistente virtual do escritório Amorim Rodrigues Advogados. Lamento pela situação. Pode me contar mais detalhes sobre o que aconteceu?',
      timestamp: horasAtras(0.5),
    },
  ],
  'lead-005': [
    {
      id: 'msg-005-1',
      leadId: 'lead-005',
      remetente: 'lead',
      conteudo: 'Boa tarde. O INSS negou minha aposentadoria e eu já tenho tempo suficiente de contribuição.',
      timestamp: horasAtras(4),
    },
    {
      id: 'msg-005-2',
      leadId: 'lead-005',
      remetente: 'ia',
      conteudo: 'Boa tarde, José! Sou a Dalva, assistente do escritório Amorim Rodrigues Advogados, especializado em direito previdenciário. Infelizmente essa situação é bem comum com o INSS. Vamos avaliar seu caso!\n\n📋 Preciso de algumas informações:\n1️⃣ Quantos anos de contribuição você tem?\n2️⃣ Qual sua idade?\n3️⃣ Você tem a carta de indeferimento do INSS?',
      timestamp: horasAtras(4),
    },
    {
      id: 'msg-005-3',
      leadId: 'lead-005',
      remetente: 'lead',
      conteudo: 'Tenho 35 anos de contribuição e 57 anos de idade. Tenho a carta de indeferimento do INSS aqui.',
      timestamp: horasAtras(3.5),
    },
    {
      id: 'msg-005-4',
      leadId: 'lead-005',
      remetente: 'ia',
      conteudo: 'José, com 35 anos de contribuição, seu caso parece bastante viável para recurso ou ação judicial. O INSS frequentemente indefere pedidos válidos.\n\n📌 Nosso advogado especialista em previdenciário pode analisar seu CNIS (extrato de contribuições) e a carta de indeferimento para identificar a melhor estratégia.\n\nPosso agendar uma análise do seu caso? É rápido e sem compromisso.',
      timestamp: horasAtras(3.5),
    },
    {
      id: 'msg-005-5',
      leadId: 'lead-005',
      remetente: 'lead',
      conteudo: 'Tenho a carta de indeferimento do INSS aqui.',
      timestamp: horasAtras(1),
    },
  ],
  'lead-010': [
    {
      id: 'msg-010-1',
      leadId: 'lead-010',
      remetente: 'lead',
      conteudo: 'Oi, vi o anúncio de vocês. Meu plano negou uma cirurgia.',
      timestamp: horasAtras(1),
    },
    {
      id: 'msg-010-2',
      leadId: 'lead-010',
      remetente: 'ia',
      conteudo: 'Olá, Luciana! Sou a Dalva, assistente virtual do escritório Amorim Rodrigues Advogados. Sinto muito por essa situação. Negativa de cobertura de plano de saúde é uma das questões mais frequentes que atendemos.\n\nPode me contar: qual cirurgia foi negada e qual a justificativa do plano?',
      timestamp: horasAtras(1),
    },
  ],
};

// ── MÉTRICAS DO DASHBOARD ──
export const mockMetricas: MetricasDashboard = {
  leadsHoje: 5,
  leadsHojeDelta: 25,
  taxaConversao: 42,
  taxaConversaoDelta: 8,
  receitaEstimada: 87500,
  receitaEstimadaDelta: 15,
  tempoMedioResposta: '12s',
  tempoMedioRespostaDelta: -30,
};

// ── LEADS POR NICHO ──
export const mockLeadsPorNicho: LeadsPorNicho[] = [
  { nicho: 'Consumidor', quantidade: 4, cor: '#3B82F6' },
  { nicho: 'Trabalhista', quantidade: 4, cor: '#8B5CF6' },
  { nicho: 'Previdenciário', quantidade: 4, cor: '#06B6D4' },
];

// ── DADOS DO FUNIL ──
export const mockDadosFunil: DadosFunil[] = [
  { etapa: 'Novos Leads', quantidade: 48, cor: '#3B82F6' },
  { etapa: 'Em Qualificação', quantidade: 32, cor: '#8B5CF6' },
  { etapa: 'Qualificados', quantidade: 20, cor: '#22C55E' },
  { etapa: 'Contrato Enviado', quantidade: 14, cor: '#F59E0B' },
  { etapa: 'Convertidos', quantidade: 9, cor: '#C9A84C' },
];

// ── ATIVIDADE RECENTE ──
export const mockAtividades: AtividadeRecente[] = [
  {
    id: 'ativ-1',
    tipo: 'novo_lead',
    descricao: 'Luciana Martins Rocha entrou em contato via WhatsApp',
    timestamp: horasAtras(1),
    nicho: 'consumidor',
  },
  {
    id: 'ativ-2',
    tipo: 'novo_lead',
    descricao: 'Carlos Roberto Oliveira enviou primeira mensagem',
    timestamp: horasAtras(0.5),
    nicho: 'trabalhista',
  },
  {
    id: 'ativ-3',
    tipo: 'qualificado',
    descricao: 'João Carlos Santos foi qualificado com score 9',
    timestamp: horasAtras(3),
    nicho: 'consumidor',
  },
  {
    id: 'ativ-4',
    tipo: 'contrato',
    descricao: 'Contrato enviado para Ana Beatriz Costa',
    timestamp: horasAtras(6),
    nicho: 'trabalhista',
  },
  {
    id: 'ativ-5',
    tipo: 'mensagem',
    descricao: 'José Antônio Pereira enviou carta de indeferimento',
    timestamp: horasAtras(1),
    nicho: 'previdenciario',
  },
  {
    id: 'ativ-6',
    tipo: 'convertido',
    descricao: 'Roberto Mendes Filho assinou contrato de honorários',
    timestamp: diasAtras(3),
    nicho: 'consumidor',
  },
  {
    id: 'ativ-7',
    tipo: 'convertido',
    descricao: 'Patrícia Souza Almeida finalizou contratação',
    timestamp: diasAtras(4),
    nicho: 'trabalhista',
  },
  {
    id: 'ativ-8',
    tipo: 'descartado',
    descricao: 'Antônio Marcos Ferreira — caso inviável (tempo insuficiente)',
    timestamp: diasAtras(2),
    nicho: 'previdenciario',
  },
];

// ── PERFORMANCE SEMANAL ──
export const mockPerformanceSemanal: PerformanceSemanal[] = [
  { dia: 'Seg', leads: 8, conversoes: 3 },
  { dia: 'Ter', leads: 12, conversoes: 4 },
  { dia: 'Qua', leads: 6, conversoes: 2 },
  { dia: 'Qui', leads: 15, conversoes: 6 },
  { dia: 'Sex', leads: 10, conversoes: 5 },
  { dia: 'Sáb', leads: 4, conversoes: 1 },
  { dia: 'Dom', leads: 3, conversoes: 1 },
];

// ── CONVERSAS ──
export function getConversas(): Conversa[] {
  return mockLeads
    .filter((lead) => lead.status !== 'descartado')
    .map((lead) => ({
      leadId: lead.id,
      lead,
      mensagens: mockMensagens[lead.id] || [],
      naoLidas: lead.status === 'novo' ? 1 : 0,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.lead.atualizadoEm).getTime();
      const dateB = new Date(b.lead.atualizadoEm).getTime();
      return dateB - dateA;
    });
}

// ── KANBAN COLUMNS ──
export function getKanbanColumns(): { id: string; titulo: string; cor: string; icone: string; leads: Lead[] }[] {
  const columns = [
    { id: 'novo', titulo: 'Novo Lead', cor: '#3B82F6', icone: '📥' },
    { id: 'qualificando', titulo: 'Em Qualificação', cor: '#8B5CF6', icone: '🤖' },
    { id: 'qualificado', titulo: 'Qualificado', cor: '#22C55E', icone: '✅' },
    { id: 'contrato_enviado', titulo: 'Contrato Enviado', cor: '#F59E0B', icone: '📄' },
    { id: 'convertido', titulo: 'Convertido', cor: '#C9A84C', icone: '🤝' },
    { id: 'descartado', titulo: 'Descartado', cor: '#EF4444', icone: '❌' },
  ];

  return columns.map((col) => ({
    ...col,
    leads: mockLeads.filter((lead) => lead.status === col.id),
  }));
}
