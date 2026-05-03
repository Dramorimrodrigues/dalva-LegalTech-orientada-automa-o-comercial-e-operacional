import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';

const COR_NICHO: Record<string, string> = {
  consumidor: '#3B82F6',
  trabalhista: '#8B5CF6',
  previdenciario: '#06B6D4',
};

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [totalLeads, leadsHoje, convertidos, leadsPorNicho, leadsPorStatus] = await Promise.all([
    prisma.lead.count({ where: { organizationId: orgId } }),
    prisma.lead.count({ where: { organizationId: orgId, createdAt: { gte: hoje } } }),
    prisma.lead.count({ where: { organizationId: orgId, status: 'convertido' } }),
    prisma.lead.groupBy({ by: ['niche'], where: { organizationId: orgId }, _count: { niche: true } }),
    prisma.lead.groupBy({ by: ['status'], where: { organizationId: orgId }, _count: { status: true } }),
  ]);

  const taxaConversao = totalLeads > 0 ? Math.round((convertidos / totalLeads) * 100) : 0;

  const scoreMedia = await prisma.lead.aggregate({
    where: { organizationId: orgId },
    _avg: { score: true },
  });

  const nichos = leadsPorNicho.map(n => ({
    nicho: n.niche.charAt(0).toUpperCase() + n.niche.slice(1),
    quantidade: n._count.niche,
    cor: COR_NICHO[n.niche] ?? '#6B7280',
  }));

  const ordemFunil = ['novo', 'qualificando', 'qualificado', 'contrato_enviado', 'convertido'];
  const labelsFunil: Record<string, string> = {
    novo: 'Novos Leads',
    qualificando: 'Em Qualificação',
    qualificado: 'Qualificados',
    contrato_enviado: 'Contrato Enviado',
    convertido: 'Convertidos',
  };
  const coresFunil: Record<string, string> = {
    novo: '#3B82F6',
    qualificando: '#8B5CF6',
    qualificado: '#22C55E',
    contrato_enviado: '#F59E0B',
    convertido: '#C9A84C',
  };
  const funil = ordemFunil.map(s => ({
    etapa: labelsFunil[s],
    quantidade: leadsPorStatus.find(l => l.status === s)?._count.status ?? 0,
    cor: coresFunil[s],
  }));

  // Performance dos últimos 7 dias
  const performance = await Promise.all(
    Array.from({ length: 7 }).map(async (_, i) => {
      const dia = new Date();
      dia.setDate(dia.getDate() - (6 - i));
      dia.setHours(0, 0, 0, 0);
      const fimDia = new Date(dia);
      fimDia.setHours(23, 59, 59, 999);
      const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const [leads, conversoes] = await Promise.all([
        prisma.lead.count({ where: { organizationId: orgId, createdAt: { gte: dia, lte: fimDia } } }),
        prisma.lead.count({ where: { organizationId: orgId, status: 'convertido', updatedAt: { gte: dia, lte: fimDia } } }),
      ]);
      return { dia: dias[dia.getDay()], leads, conversoes };
    })
  );

  return ok({
    kpis: { leadsHoje, taxaConversao, totalLeads, convertidos },
    nichos,
    funil,
    performance,
  });
}
