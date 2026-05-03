import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { qualificarLead } from '@/lib/ai';

const INSTANCE = process.env.EVOLUTION_INSTANCE ?? 'dalva-escritorio';
const EVO_URL = process.env.EVOLUTION_API_URL;
const EVO_KEY = process.env.EVOLUTION_API_KEY;

async function sendWhatsApp(phone: string, text: string) {
  if (!EVO_URL || !EVO_KEY) return;
  await fetch(`${EVO_URL}/message/sendText/${INSTANCE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: EVO_KEY },
    body: JSON.stringify({ number: phone, text }),
  });
}

// POST /api/webhook/whatsapp — recebe mensagens da Evolution API
export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false }); }

  // Ignorar eventos que não são mensagens recebidas
  if (body.event !== 'messages.upsert') return NextResponse.json({ ok: true });
  const data = body.data;
  if (!data || data.key?.fromMe) return NextResponse.json({ ok: true });

  // Extrair número e conteúdo
  const remoteJid: string = data.key?.remoteJid ?? '';
  const phone = remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '');
  const content: string =
    data.message?.conversation ??
    data.message?.extendedTextMessage?.text ??
    '[mídia]';
  const pushName: string = data.pushName ?? phone;

  if (!phone || content === '[mídia]') return NextResponse.json({ ok: true });

  // Encontrar organização pela instância (pegamos a primeira disponível)
  const org = await prisma.organization.findFirst();
  if (!org) return NextResponse.json({ ok: false });

  // Encontrar ou criar o lead
  let lead = await prisma.lead.findFirst({
    where: { phone, organizationId: org.id },
  });

  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        name: pushName,
        phone,
        niche: 'inicial' as any,
        status: 'novo',
        score: 0,
        lastMessage: content,
        organizationId: org.id,
      },
    });
  }

  // Salvar mensagem do lead
  await prisma.message.create({
    data: { leadId: lead.id, sender: 'lead', content },
  });

  // Buscar histórico completo
  const historico = await prisma.message.findMany({
    where: { leadId: lead.id },
    orderBy: { createdAt: 'asc' },
    select: { sender: true, content: true },
  });

  // Chamar IA para qualificar
  const nicho = lead.niche === 'inicial' ? 'inicial' : lead.niche;
  const aiResponse = await qualificarLead(historico, nicho);

  // Salvar resposta da IA
  await prisma.message.create({
    data: { leadId: lead.id, sender: 'ia', content: aiResponse.message },
  });

  // Atualizar lead com dados da IA
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      niche: aiResponse.niche === 'inicial' ? lead.niche : aiResponse.niche,
      status: aiResponse.status,
      score: aiResponse.score,
      aiSummary: aiResponse.summary || lead.aiSummary,
      lastMessage: aiResponse.message,
    },
  });

  // Enviar resposta pelo WhatsApp
  await sendWhatsApp(phone, aiResponse.message);

  return NextResponse.json({ ok: true });
}
