import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { User } from '@/lib/models';
import { sign, bcrypt } from '@/lib/auth';

export async function POST(req) {
  await db();
  const { email, password } = await req.json();
  const u = await User.findOne({ email: (email || '').toLowerCase().trim(), active: true });
  if (!u || !(await bcrypt.compare(password || '', u.password))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  const token = await sign({ id: String(u._id), name: u.name, role: u.role });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  return res;
}
