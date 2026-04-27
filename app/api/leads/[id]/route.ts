// =============================================================
// DALVA — API: Lead Individual
// GET    /api/leads/[id]  → Busca um lead específico
// PATCH  /api/leads/[id]  → Atualiza status ou dados do lead
// DELETE /api/leads/[id]  → Remove um lead
// =============================================================

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';
import { z } from 'zod';

// ── Validação para atualização parcial ──
const updateLeadSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(20).optional(),
  status: z.enum(['NOVO', 'QUALIFICADO', 'EM_ATENDIMENTO', 'CONTRATO_ENVIADO', 'FECHADO', 'PERDIDO']).optional(),
  score: z.number().int().min(0).max(100).optional(),
  aiSummary: z.string().max(1000).optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'Nenhum campo para atualizar',
});

// ── Função auxiliar: verifica se o lead pertence à organização do usuário ──
async function findLeadInOrg(leadId: string, orgId: string) {
  return prisma.lead.findFirst({
    where: { id: leadId, organizationId: orgId },
  });
}

// Next.js 15: params é uma Promise
type RouteParams = { params: Promise<{ id: string }> };

// ── GET /api/leads/[id] ──
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const lead = await findLeadInOrg(id, orgId);
  if (!lead) return err('Lead não encontrado', 404);

  return ok(lead);
}

// ── PATCH /api/leads/[id] ──
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const existing = await findLeadInOrg(id, orgId);
  if (!existing) return err('Lead não encontrado', 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('JSON inválido');
  }

  const parsed = updateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message, 422);
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: parsed.data,
  });

  return ok(updated);
}

// ── DELETE /api/leads/[id] ──
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const existing = await findLeadInOrg(id, orgId);
  if (!existing) return err('Lead não encontrado', 404);

  await prisma.lead.delete({ where: { id } });

  return ok({ message: 'Lead removido com sucesso' });
}
