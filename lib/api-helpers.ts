// =============================================================
// DALVA — API Helper Functions
// Funções reutilizáveis para autenticação e respostas padronizadas
// =============================================================

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ── Tipo da sessão estendida ──
export interface DalvaSession {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    organizationId: string;
  };
}

// ── Verifica autenticação e retorna sessão ──
export async function requireAuth(): Promise<{ session: DalvaSession | null; error: NextResponse | null }> {
  const session = await getServerSession(authOptions) as DalvaSession | null;
  
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Não autorizado. Faça login para continuar.' }, { status: 401 }),
    };
  }
  
  return { session, error: null };
}

// ── Busca o organizationId do usuário logado ──
export async function getOrgId(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { organizationId: true },
  });
  return user?.organizationId ?? null;
}

// ── Respostas padronizadas ──
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}
