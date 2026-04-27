'use client';

import { DadosFunil } from '@/lib/types';

interface FunnelChartProps {
  data: DadosFunil[];
}

export default function FunnelChart({ data }: FunnelChartProps) {
  const max = data[0]?.quantidade || 1;

  return (
    <div className="glass-card p-5 animate-slide-in-up" style={{ animationDelay: '250ms' }}>
      <h3 className="text-sm font-semibold text-dalva-text-primary mb-5">Funil de Conversão</h3>
      <div className="space-y-3">
        {data.map((item, i) => {
          const width = Math.max(25, (item.quantidade / max) * 100);
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-[110px] text-right">
                <span className="text-xs text-dalva-text-muted">{item.etapa}</span>
              </div>
              <div className="flex-1 h-8 bg-dalva-surface rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-700 ease-out"
                  style={{
                    width: `${width}%`,
                    background: `linear-gradient(90deg, ${item.cor}20, ${item.cor}60)`,
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <span className="text-xs font-bold" style={{ color: item.cor }}>
                    {item.quantidade}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-dalva-border flex items-center justify-between">
        <span className="text-xs text-dalva-text-muted">Taxa de conversão geral</span>
        <span className="text-sm font-bold text-dalva-gold">
          {Math.round((data[data.length - 1].quantidade / data[0].quantidade) * 100)}%
        </span>
      </div>
    </div>
  );
}
