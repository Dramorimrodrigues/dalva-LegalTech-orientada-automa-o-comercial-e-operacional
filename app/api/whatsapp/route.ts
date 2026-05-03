import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getOrgId, ok, err } from '@/lib/api-helpers';

const EVO_URL = () => process.env.EVOLUTION_API_URL;
const EVO_KEY = () => process.env.EVOLUTION_API_KEY;
const INSTANCE = () => process.env.EVOLUTION_INSTANCE ?? 'dalva-escritorio';

async function evoFetch(path: string, options?: RequestInit) {
  const url = EVO_URL();
  const key = EVO_KEY();
  if (!url || !key) throw new Error('Evolution API não configurada');
  return fetch(`${url}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', apikey: key, ...(options?.headers ?? {}) },
  });
}

// GET /api/whatsapp — retorna status e QR code
export async function GET(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  const session_ = await prisma.whatsAppSession.findUnique({ where: { organizationId: orgId } });

  if (!EVO_URL() || !EVO_KEY()) {
    return ok({ status: 'not_configured', qrCode: null });
  }

  try {
    const stateRes = await evoFetch(`/instance/connectionState/${INSTANCE()}`);
    const stateData = await stateRes.json();
    const state = stateData?.instance?.state ?? 'close';

    if (state === 'open') {
      if (session_?.status !== 'connected') {
        await prisma.whatsAppSession.upsert({
          where: { organizationId: orgId },
          update: { status: 'connected', qrCode: null },
          create: { organizationId: orgId, instanceName: INSTANCE(), status: 'connected' },
        });
      }
      return ok({ status: 'connected', qrCode: null });
    }

    // Busca QR code
    const qrRes = await evoFetch(`/instance/connect/${INSTANCE()}`);
    const qrData = await qrRes.json();
    const qrCode = qrData?.base64 ?? null;

    await prisma.whatsAppSession.upsert({
      where: { organizationId: orgId },
      update: { status: 'connecting', qrCode },
      create: { organizationId: orgId, instanceName: INSTANCE(), status: 'connecting', qrCode },
    });

    return ok({ status: 'connecting', qrCode });
  } catch (e: any) {
    return ok({ status: 'disconnected', qrCode: null, error: e.message });
  }
}

// POST /api/whatsapp — ações: connect | disconnect
export async function POST(req: NextRequest) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const orgId = await getOrgId(session!.user.email);
  if (!orgId) return err('Organização não encontrada', 404);

  let body: any;
  try { body = await req.json(); } catch { return err('JSON inválido'); }

  if (!EVO_URL() || !EVO_KEY()) return err('Evolution API não configurada');

  if (body.action === 'connect') {
    try {
      // Cria instância se não existir
      await evoFetch('/instance/create', {
        method: 'POST',
        body: JSON.stringify({
          instanceName: INSTANCE(),
          token: EVO_KEY(),
          qrcode: true,
          integration: 'WHATSAPP-BAILEYS',
        }),
      });
    } catch {}

    // Configura webhook
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    try {
      await evoFetch(`/webhook/set/${INSTANCE()}`, {
        method: 'POST',
        body: JSON.stringify({
          webhook: { enabled: true, url: `${appUrl}/api/webhook/whatsapp`, byEvents: true, base64: true },
          events: ['MESSAGES_UPSERT'],
        }),
      });
    } catch {}

    return ok({ message: 'Conexão iniciada. Escaneie o QR code.' });
  }

  if (body.action === 'disconnect') {
    try {
      await evoFetch(`/instance/logout/${INSTANCE()}`, { method: 'DELETE' });
    } catch {}
    await prisma.whatsAppSession.upsert({
      where: { organizationId: orgId },
      update: { status: 'disconnected', qrCode: null },
      create: { organizationId: orgId, instanceName: INSTANCE(), status: 'disconnected' },
    });
    return ok({ message: 'Desconectado.' });
  }

  return err('Ação inválida');
}
