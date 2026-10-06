import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();
  const token = req.cookies.get('token')?.value;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-change-me'));
    return NextResponse.next();
  } catch {
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
