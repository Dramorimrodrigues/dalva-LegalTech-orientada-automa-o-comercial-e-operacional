'use client';

import { useEffect, useState } from 'react';
import { Users, Target, DollarSign, Clock } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import NichoPieChart from '@/components/dashboard/NichoPieChart';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import FunnelChart from '@/components/dashboard/FunnelChart';
import ActivityTimeline from '@/components/dashboard/ActivityTimeline';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/metrics')
      .then(r => r.json())
      .then(res => { if (res.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-dalva-gold/30 border-t-dalva-gold rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = data?.kpis ?? { leadsHoje: 0, taxaConversao: 0, totalLeads: 0, convertidos: 0 };
  const nichos = data?.nichos ?? [];
  const funil = data?.funil ?? [];
  const performance = data?.performance ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dalva-text-primary">Dashboard</h2>
        <p className="text-sm text-dalva-text-muted mt-1">
          Visão geral do funil de captação — Amorim Rodrigues Advogados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 stagger-children">
        <MetricCard title="Leads Hoje" value={kpis.leadsHoje} delta={0} icon={Users} color="#3B82F6" delay={0} />
        <MetricCard title="Taxa de Conversão" value={kpis.taxaConversao} delta={0} icon={Target} color="#22C55E" suffix="%" delay={50} />
        <MetricCard title="Total de Leads" value={kpis.totalLeads} delta={0} icon={DollarSign} color="#C9A84C" delay={100} />
        <MetricCard title="Convertidos" value={kpis.convertidos} delta={0} icon={Clock} color="#8B5CF6" delay={150} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <NichoPieChart data={nichos} />
        <div className="lg:col-span-2">
          <PerformanceChart data={performance} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FunnelChart data={funil} />
        <ActivityTimeline atividades={[]} />
      </div>
    </div>
  );
}
