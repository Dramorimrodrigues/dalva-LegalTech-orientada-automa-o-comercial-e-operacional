'use client';

import { TrendingUp, TrendingDown, Users, Target, DollarSign, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta: number;
  icon: React.ElementType;
  color: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

export default function MetricCard({ title, value, delta, icon: Icon, color, prefix, suffix, delay = 0 }: MetricCardProps) {
  const isPositive = delta >= 0;

  return (
    <div
      className="glass-card-hover p-5 animate-slide-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
            isPositive ? 'bg-dalva-green-muted text-green-400' : 'bg-dalva-red-muted text-red-400'
          )}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(delta)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-dalva-text-primary">
        {prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR') : value}{suffix}
      </p>
      <p className="text-sm text-dalva-text-muted mt-1">{title}</p>
    </div>
  );
}
