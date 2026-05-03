import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';
import { mapMessage } from '@/lib/mappers';

// GET /api/conversations/[leadId]/messages
export async function GET(req: NextRequest, { params }: { params: { leadId: string } }) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const lead = await prisma.lead.findFirst({
    where: { id: params.leadId, organizationId: orgId },
  });
  if (!lead) return err('Conversa não encontrada', 404);

  const messages = await prisma.message.findMany({
    where: { leadId: params.leadId },
    orderBy: { createdAt: 'asc' },
  });

  return ok(messages.map(mapMessage));
}

// POST /api/conversations/[leadId]/messages — advogado envia mensagem
export async function POST(req: NextRequest, { params }: { params: { leadId: string } }) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const lead = await prisma.lead.findFirst({
    where: { id: params.leadId, organizationId: orgId },
  });
  if (!lead) return err('Conversa não encontrada', 404);

  let body: any;
  try { body = await req.json(); } catch { return err('JSON inválido'); }

  if (!body?.content?.trim()) return err('Mensagem não pode ser vazia');

  const msg = await prisma.message.create({
    data: {
      leadId: params.leadId,
      sender: 'advogado',
      content: body.content.trim(),
    },
  });

  // Atualiza lastMessage e updatedAt do lead
  await prisma.lead.update({
    where: { id: params.leadId },
    data: { lastMessage: body.content.trim() },
  });

  // Se tiver Evolution API configurada, enviar pelo WhatsApp
  const EVOLUTION_URL = process.env.EVOLUTION_API_URL;
  const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY;
  const INSTANCE = process.env.EVOLUTION_INSTANCE;

  if (EVOLUTION_URL && EVOLUTION_KEY && INSTANCE) {
    try {
      await fetch(`${EVOLUTION_URL}/message/sendText/${INSTANCE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': EVOLUTION_KEY },
        body: JSON.stringify({ number: lead.phone, text: body.content.trim() }),
      });
    } catch (e) {
      console.error('Erro ao enviar WhatsApp:', e);
    }
  }

  return ok(mapMessage(msg), 201);
}
