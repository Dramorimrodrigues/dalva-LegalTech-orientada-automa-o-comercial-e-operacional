// =============================================================
// DALVA — API: Dashboard Metrics
// GET /api/dashboard/metrics → KPIs e dados dos gráficos
// =============================================================

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';h
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  // Data de hoje (início do dia)
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Data de 7 dias atrás
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
  seteDiasAtras.setHours(0, 0, 0, 0);

  // Executar todas as queries em paralelo para performance
  const [
    totalLeads,
    leadsHoje,
    leadsFechados,
    leadsQualificados,
    leadsPorNicho,
    leadsPorStatus,
  ] = await Promise.all([
    // Total de leads
    prisma.lead.count({ where: { organizationId: orgId } }),

    // Leads criados hoje
    prisma.lead.count({
      where: {
        organizationId: orgId,
        createdAt: { gte: hoje },
      },
    }),

    // Leads fechados (convertidos)
    prisma.lead.count({
      where: {
        organizationId: orgId,
        status: 'FECHADO',
      },
    }),

    // Leads qualificados
    prisma.lead.count({
      where: {
        organizationId: orgId,
        status: 'QUALIFICADO',
      },
    }),

    // Leads por nicho jurídico
    prisma.lead.groupBy({
      by: ['niche'],
      where: { organizationId: orgId },
      _count: { niche: true },
    }),

    // Leads por status (para o funil)
    prisma.lead.groupBy({
      by: ['status'],
      where: { organizationId: orgId },
      _count: { status: true },
    }),
  ]);

  // Taxa de conversão
  const taxaConversao = totalLeads > 0
    ? Math.round((leadsFechados / totalLeads) * 100)
    : 0;

  // Score médio dos leads
  const scoreMedia = await prisma.lead.aggregate({
    where: { organizationId: orgId },
    _avg: { score: true },
  });

  // Formatar dados por nicho para o gráfico de pizza
  const nichos = leadsPorNicho.map((n: any) => ({
    nome: n.niche,
    quantidade: n._count.niche,
    cor: n.niche === 'Trabalhista' ? '#C5A028'
      : n.niche === 'Previdenciário' ? '#3B82F6'
      : '#10B981',
  }));

  // Formatar funil de conversão
  const ordemFunil = ['NOVO', 'QUALIFICADO', 'EM_ATENDIMENTO', 'CONTRATO_ENVIADO', 'FECHADO'];
  const funil = ordemFunil.map(s => {
    const item = leadsPorStatus.find(l => l.status === s);
    return {
      etapa: s.replace('_', ' '),
      quantidade: item?._count.status ?? 0,
    };
  });

  return ok({
    kpis: {
      leadsHoje,
      taxaConversao,
      totalLeads,
      leadsQualificados,
      scoreMedio: Math.round(scoreMedia._avg.score ?? 0),
    },
    nichos,
    funil,
  });
}
