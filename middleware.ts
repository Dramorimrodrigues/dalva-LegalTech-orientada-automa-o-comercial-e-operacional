// =============================================================
// DALVA — Route Protection Middleware
// Protege todas as rotas autenticadas contra acesso direto
// =============================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que NÃO precisam de autenticação
const PUBLIC_ROUTES = ['/login', '/api/auth'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permite rotas públicas, assets e APIs do Next.js
  if (
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Verifica se o token de autenticação existe
  const authToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  if (!authToken) {
    // Redireciona para login preservando a URL de destino
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Adiciona headers de segurança adicionais por rota
  const response = NextResponse.next();

  // Previne caching de páginas autenticadas
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
