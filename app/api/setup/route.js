import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { User, City } from '@/lib/models';
import { bcrypt } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// Visit /api/setup ONCE after deploying. It creates the first admin and a few cities.
export async function GET() {
  await db();
  if (await User.countDocuments()) return NextResponse.json({ message: 'Setup already done. Go to /admin/login' });
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return NextResponse.json({ error: 'Set ADMIN_EMAIL and ADMIN_PASSWORD in environment variables first' }, { status: 400 });
  await User.create({ name: 'Admin', email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 10), role: 'admin' });
  const names = ['Pune', 'Wakad', 'Baner', 'Hinjewadi', 'Tathawade', 'Punawale', 'Balewadi', 'Ravet', 'Kothrud', 'Pimple Saudagar', 'Kiwale', 'Akurdi'];
  for (const name of names) await City.create({ name, slug: slugify(name) }).catch(() => {});
  return NextResponse.json({ message: 'Done! Admin created. Go to /admin/login' });
}
