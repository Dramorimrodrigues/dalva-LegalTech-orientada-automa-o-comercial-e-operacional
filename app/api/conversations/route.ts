import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';
import { mapLead } from '@/lib/mappers';

// GET /api/conversations — lista leads com conversas ativas
export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const leads = await prisma.lead.findMany({
    where: {
      organizationId: orgId,
      status: { not: 'descartado' },
    },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });

  const conversas = leads.map(lead => ({
    leadId: lead.id,
    lead: mapLead(lead),
    naoLidas: lead.status === 'novo' ? 1 : 0,
    totalMensagens: lead._count.messages,
  }));

  return ok(conversas);
}
