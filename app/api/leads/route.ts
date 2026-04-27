// =============================================================
// DALVA — API: Leads
// GET  /api/leads  → Lista todos os leads da organização
// POST /api/leads  → Cria um novo lead
// =============================================================

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';
import { z } from 'zod';

// ── Validação para criação de lead ──
const createLeadSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(100),
  phone: z.string().min(10, 'Telefone inválido').max(20),
  niche: z.enum(['Trabalhista', 'Previdenciário', 'Consumidor']),
  score: z.number().int().min(0).max(100).default(0),
  aiSummary: z.string().max(1000).optional(),
});

// ── GET /api/leads ──
export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  // Parâmetros de busca/filtro da URL
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const niche = searchParams.get('niche') || '';
  const status = searchParams.get('status') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  const leads = await prisma.lead.findMany({
    where: {
      organizationId: orgId,
      // Filtro de busca por nome ou telefone
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q } },
        ],
      }),
      // Filtro por nicho jurídico
      ...(niche && { niche }),
      // Filtro por status
      ...(status && { status: status as any }),
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.lead.count({
    where: {
      organizationId: orgId,
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q } },
        ],
      }),
      ...(niche && { niche }),
      ...(status && { status: status as any }),
    },
  });

  return ok({ leads, total, page, limit });
}

// ── POST /api/leads ──
export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err('JSON inválido no corpo da requisição');
  }

  const parsed = createLeadSchema.safeParse(body);
  if (!parsed.success) {
    return err(parsed.error.issues[0].message, 422);
  }

  const lead = await prisma.lead.create({
    data: {
      ...parsed.data,
      organizationId: orgId,
    },
  });

  return ok(lead, 201);
}
