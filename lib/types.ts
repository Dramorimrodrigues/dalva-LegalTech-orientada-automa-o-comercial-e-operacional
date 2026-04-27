// =============================================================
// DALVA — Core Types
// Plataforma LegalTech para Amorim Rodrigues Advogados
// =============================================================

export type NichoJuridico = 'consumidor' | 'trabalhista' | 'previdenciario';

export type LeadStatus =
  | 'novo'
  | 'qualificando'
  | 'qualificado'
  | 'contrato_enviado'
  | 'convertido'
  | 'descartado';

export type MessageSender = 'lead' | 'ia' | 'advogado';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  nicho: NichoJuridico;
  status: LeadStatus;
  score: number; // 1-10
  resumoCaso: string;
  criadoEm: string;
  atualizadoEm: string;
  ultimaMensagem: string;
  avatar?: string;
}

export interface Mensagem {
  id: string;
  leadId: string;
  remetente: MessageSender;
  conteudo: string;
  timestamp: string;
}

export interface Conversa {
  leadId: string;
  lead: Lead;
  mensagens: Mensagem[];
  naoLidas: number;
}

export interface MetricasDashboard {
  leadsHoje: number;
  leadsHojeDelta: number;
  taxaConversao: number;
  taxaConversaoDelta: number;
  receitaEstimada: number;
  receitaEstimadaDelta: number;
  tempoMedioResposta: string;
  tempoMedioRespostaDelta: number;
}

export interface LeadsPorNicho {
  nicho: string;
  quantidade: number;
  cor: string;
}

export interface DadosFunil {
  etapa: string;
  quantidade: number;
  cor: string;
}

export interface AtividadeRecente {
  id: string;
  tipo: 'novo_lead' | 'qualificado' | 'contrato' | 'convertido' | 'descartado' | 'mensagem';
  descricao: string;
  timestamp: string;
  nicho: NichoJuridico;
}

export interface PerformanceSemanal {
  dia: string;
  leads: number;
  conversoes: number;
}

export interface KanbanColumn {
  id: LeadStatus;
  titulo: string;
  cor: string;
  icone: string;
  leads: Lead[];
}

export const NICHO_CONFIG: Record<NichoJuridico, { label: string; cor: string; corBg: string; icone: string }> = {
  consumidor: {
    label: 'Consumidor',
    cor: '#3B82F6',
    corBg: 'rgba(59, 130, 246, 0.15)',
    icone: '🛒',
  },
  trabalhista: {
    label: 'Trabalhista',
    cor: '#8B5CF6',
    corBg: 'rgba(139, 92, 246, 0.15)',
    icone: '⚒️',
  },
  previdenciario: {
    label: 'Previdenciário',
    cor: '#06B6D4',
    corBg: 'rgba(6, 182, 212, 0.15)',
    icone: '🏛️',
  },
};

export const STATUS_CONFIG: Record<LeadStatus, { label: string; cor: string; corBg: string; icone: string }> = {
  novo: {
    label: 'Novo Lead',
    cor: '#3B82F6',
    corBg: 'rgba(59, 130, 246, 0.15)',
    icone: '📥',
  },
  qualificando: {
    label: 'Em Qualificação',
    cor: '#8B5CF6',
    corBg: 'rgba(139, 92, 246, 0.15)',
    icone: '🤖',
  },
  qualificado: {
    label: 'Qualificado',
    cor: '#22C55E',
    corBg: 'rgba(34, 197, 94, 0.15)',
    icone: '✅',
  },
  contrato_enviado: {
    label: 'Contrato Enviado',
    cor: '#F59E0B',
    corBg: 'rgba(245, 158, 11, 0.15)',
    icone: '📄',
  },
  convertido: {
    label: 'Convertido',
    cor: '#C9A84C',
    corBg: 'rgba(201, 168, 76, 0.15)',
    icone: '🤝',
  },
  descartado: {
    label: 'Descartado',
    cor: '#EF4444',
    corBg: 'rgba(239, 68, 68, 0.15)',
    icone: '❌',
  },
};
