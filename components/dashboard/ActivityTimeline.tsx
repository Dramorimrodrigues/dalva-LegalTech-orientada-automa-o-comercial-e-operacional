'use client';

import { AtividadeRecente, NICHO_CONFIG } from '@/lib/types';
import { timeAgo } from '@/lib/utils';
import { UserPlus, CheckCircle, FileText, Handshake, XCircle, MessageSquare } from 'lucide-react';

interface ActivityTimelineProps {
  atividades: AtividadeRecente[];
}

const tipoIcons: Record<string, React.ElementType> = {
  novo_lead: UserPlus,
  qualificado: CheckCircle,
  contrato: FileText,
  convertido: Handshake,
  descartado: XCircle,
  mensagem: MessageSquare,
};

const tipoCores: Record<string, string> = {
  novo_lead: '#3B82F6',
  qualificado: '#22C55E',
  contrato: '#F59E0B',
  convertido: '#C9A84C',
  descartado: '#EF4444',
  mensagem: '#8B5CF6',
};

export default function ActivityTimeline({ atividades }: ActivityTimelineProps) {
  return (
    <div className="glass-card p-5 animate-slide-in-up" style={{ animationDelay: '350ms' }}>
      <h3 className="text-sm font-semibold text-dalva-text-primary mb-4">Atividade Recente</h3>
      <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
        {atividades.map((ativ, i) => {
          const Icon = tipoIcons[ativ.tipo] || MessageSquare;
          const cor = tipoCores[ativ.tipo] || '#64748B';
          const nicho = NICHO_CONFIG[ativ.nicho];

          return (
            <div
              key={ativ.id}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${cor}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: cor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-dalva-text-secondary leading-relaxed">{ativ.descricao}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-dalva-text-muted" suppressHydrationWarning>{timeAgo(ativ.timestamp)}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
                    style={{ background: nicho.corBg, color: nicho.cor }}
                  >
                    {nicho.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
