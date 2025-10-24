import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Vérifier si c'est une route admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Exclure la page de login
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Vérifier simplement la présence du token
    // La vérification complète sera faite côté serveur dans les API routes
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Token présent, continuer
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};