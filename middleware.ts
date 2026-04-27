import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt-utils';

// Rotas públicas (não precisam de autenticação)
const PUBLIC_ROUTES = ['/login', '/api/auth/login'];

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

  // Tenta pegar o token do cookie
  const authToken = request.cookies.get('auth-token')?.value;

  if (!authToken) {
        // Se não tem token, redireciona para login
      const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
  }

  // Verifica se o token é válido
  const decoded = verifyToken(authToken);

  if (!decoded) {
        // Token inválido/expirado, redireciona para login
      const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
  }

  // Token válido, permite acesso
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
