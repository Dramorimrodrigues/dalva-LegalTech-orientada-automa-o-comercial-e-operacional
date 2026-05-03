import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';
import { mapLead } from '@/lib/mappers';
import { z } from 'zod';

const createLeadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  niche: z.enum(['consumidor', 'trabalhista', 'previdenciario']),
  score: z.number().int().min(0).max(10).default(0),
  aiSummary: z.string().max(1000).optional(),
});

export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const niche = searchParams.get('niche') || '';
  const status = searchParams.get('status') || '';

  const leads = await prisma.lead.findMany({
    where: {
      organizationId: orgId,
      ...(q && { OR: [{ name: { contains: q, mode: 'insensitive' } }, { phone: { contains: q } }] }),
      ...(niche && { niche }),
      ...(status && { status }),
    },
    orderBy: { updatedAt: 'desc' },
  });

  const total = leads.length;
  return ok({ leads: leads.map(mapLead), total });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  let body: unknown;
  try { body = await req.json(); } catch { return err('JSON inválido'); }

  const parsed = createLeadSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.issues[0].message, 422);

  const lead = await prisma.lead.create({ data: { ...parsed.data, organizationId: orgId } });
  return ok(mapLead(lead), 201);
}
