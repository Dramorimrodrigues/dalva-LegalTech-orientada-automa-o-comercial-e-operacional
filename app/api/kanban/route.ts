// =============================================================
// DALVA — API: Kanban
// GET   /api/kanban          → Colunas com leads agrupados por status
// PATCH /api/kanban/move     → Move um lead para outra coluna
// =============================================================

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';

const KANBAN_COLUMNS = [
  { id: 'NOVO',             label: 'Novos Leads',         cor: '#6B7280' },
  { id: 'QUALIFICADO',      label: 'Qualificados',        cor: '#C5A028' },
  { id: 'EM_ATENDIMENTO',   label: 'Em Atendimento',      cor: '#3B82F6' },
  { id: 'CONTRATO_ENVIADO', label: 'Contrato Enviado',    cor: '#8B5CF6' },
  { id: 'FECHADO',          label: 'Fechados ✓',          cor: '#10B981' },
  { id: 'PERDIDO',          label: 'Perdidos',            cor: '#EF4444' },
] as const;

// ── GET /api/kanban ──
export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  // Busca todos os leads da organização
  const leads = await prisma.lead.findMany({
    where: { organizationId: orgId },
    orderBy: [
      { score: 'desc' },    // Mais qualificados primeiro
      { createdAt: 'desc' },
    ],
  });

  // Agrupa os leads por coluna (status)
  const colunas = KANBAN_COLUMNS.map(col => ({
    ...col,
    leads: leads.filter(l => l.status === col.id),
  }));

  return ok({ colunas });
}
