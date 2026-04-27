'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PerformanceSemanal } from '@/lib/types';

interface PerformanceChartProps {
  data: PerformanceSemanal[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs space-y-1">
        <p className="text-dalva-text-primary font-medium">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="glass-card p-5 animate-slide-in-up" style={{ animationDelay: '300ms' }}>
      <h3 className="text-sm font-semibold text-dalva-text-primary mb-4">Performance Semanal</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
            <XAxis
              dataKey="dia"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="leads" name="Leads" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={24} />
            <Bar dataKey="conversoes" name="Conversões" fill="#C9A84C" radius={[4, 4, 0, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-xs text-dalva-text-muted">Leads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-dalva-gold" />
          <span className="text-xs text-dalva-text-muted">Conversões</span>
        </div>
      </div>
    </div>
  );
}
