import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';
import { mapLead } from '@/lib/mappers';

const COLUNAS = [
  { id: 'novo',             titulo: 'Novo Lead',        cor: '#3B82F6', icone: '📥' },
  { id: 'qualificando',     titulo: 'Em Qualificação',  cor: '#8B5CF6', icone: '🤖' },
  { id: 'qualificado',      titulo: 'Qualificado',      cor: '#22C55E', icone: '✅' },
  { id: 'contrato_enviado', titulo: 'Contrato Enviado', cor: '#F59E0B', icone: '📄' },
  { id: 'convertido',       titulo: 'Convertido',       cor: '#C9A84C', icone: '🤝' },
  { id: 'descartado',       titulo: 'Descartado',       cor: '#EF4444', icone: '❌' },
] as const;

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const leads = await prisma.lead.findMany({
    where: { organizationId: orgId },
    orderBy: [{ score: 'desc' }, { updatedAt: 'desc' }],
  });

  const colunas = COLUNAS.map(col => ({
    ...col,
    leads: leads.filter(l => l.status === col.id).map(mapLead),
  }));

  return ok({ colunas });
}

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  let body: any;
  try { body = await req.json(); } catch { return err('JSON inválido'); }

  const { leadId, newStatus } = body;
  if (!leadId || !newStatus) return err('leadId e newStatus são obrigatórios');

  const validStatuses = COLUNAS.map(c => c.id);
  if (!validStatuses.includes(newStatus)) return err('Status inválido', 422);

  const lead = await prisma.lead.findFirst({ where: { id: leadId, organizationId: orgId } });
  if (!lead) return err('Lead não encontrado', 404);

  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: { status: newStatus },
  });

  return ok(mapLead(updated));
}
