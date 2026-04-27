'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LeadsPorNicho } from '@/lib/types';

interface NichoPieChartProps {
  data: LeadsPorNicho[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        <p className="text-dalva-text-primary font-medium">{payload[0].name}</p>
        <p className="text-dalva-text-secondary">{payload[0].value} leads</p>
      </div>
    );
  }
  return null;
};

export default function NichoPieChart({ data }: NichoPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.quantidade, 0);

  return (
    <div className="glass-card p-5 animate-slide-in-up" style={{ animationDelay: '200ms' }}>
      <h3 className="text-sm font-semibold text-dalva-text-primary mb-4">Leads por Nicho</h3>
      <div className="flex items-center gap-6">
        <div className="w-[140px] h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={4}
                dataKey="quantidade"
                nameKey="nicho"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.cor }} />
                <span className="text-xs text-dalva-text-secondary">{item.nicho}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-dalva-text-primary">{item.quantidade}</span>
                <span className="text-[10px] text-dalva-text-muted">
                  ({Math.round((item.quantidade / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
