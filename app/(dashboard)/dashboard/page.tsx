'use client';

import { Users, Target, DollarSign, Clock } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import NichoPieChart from '@/components/dashboard/NichoPieChart';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import FunnelChart from '@/components/dashboard/FunnelChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import { formatCurrency } from '@/lib/utils';
import {
  mockMetricas,
  mockLeadsPorNicho,
  mockPerformanceSemanal,
  mockDadosFunil,
  mockAtividades,
} from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-dalva-text-primary">Dashboard</h2>
        <p className="text-sm text-dalva-text-muted mt-1">
          Visão geral do funil de captação — Amorim Rodrigues Advogados
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 stagger-children">
        <MetricCard
          title="Leads Hoje"
          value={mockMetricas.leadsHoje}
          delta={mockMetricas.leadsHojeDelta}
          icon={Users}
          color="#3B82F6"
          delay={0}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={mockMetricas.taxaConversao}
          delta={mockMetricas.taxaConversaoDelta}
          icon={Target}
          color="#22C55E"
          suffix="%"
          delay={50}
        />
        <MetricCard
          title="Receita Estimada"
          value={formatCurrency(mockMetricas.receitaEstimada)}
          delta={mockMetricas.receitaEstimadaDelta}
          icon={DollarSign}
          color="#C9A84C"
          delay={100}
        />
        <MetricCard
          title="Tempo Médio de Resposta"
          value={mockMetricas.tempoMedioResposta}
          delta={mockMetricas.tempoMedioRespostaDelta}
          icon={Clock}
          color="#8B5CF6"
          delay={150}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <NichoPieChart data={mockLeadsPorNicho} />
        <div className="lg:col-span-2">
          <PerformanceChart data={mockPerformanceSemanal} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelChart data={mockDadosFunil} />
        <ActivityTimeline atividades={mockAtividades} />
      </div>
    </div>
  );
}
