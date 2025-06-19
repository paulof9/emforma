import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  const rotaPublica = pathname === '/login' || pathname === '/register';
  const rotaProtegida = pathname.startsWith('/dashboard');

  // Se tentar uma rota protegida sem um token, redireciona para o login
  if (rotaProtegida && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se estiver autenticado e tentar uma rota pública (login/registo), redireciona para o dashboard
  if (rotaPublica && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// middleware só se aplica a páginas e não com a api.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};