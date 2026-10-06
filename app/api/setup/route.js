import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { User, City } from '@/lib/models';
import { bcrypt } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// Visit /api/setup after deploying. It creates (or resets) the admin using ADMIN_EMAIL and ADMIN_PASSWORD.
export async function GET() {
  await db();
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || '').trim();
  if (!email || !password) {
    return NextResponse.json({ error: 'Set ADMIN_EMAIL and ADMIN_PASSWORD in Vercel environment variables first' }, { status: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email },
    { name: 'Admin', email, password: hash, role: 'admin', active: true },
    { upsert: true }
  );
  if (!(await City.countDocuments())) {
    const names = ['Pune', 'Wakad', 'Baner', 'Hinjewadi', 'Tathawade', 'Punawale', 'Balewadi', 'Ravet', 'Kothrud', 'Pimple Saudagar', 'Kiwale', 'Akurdi'];
    for (const name of names) await City.create({ name, slug: slugify(name) }).catch(() => {});
  }
  return NextResponse.json({ message: 'Admin ready. Login with email: ' + email + ' and your ADMIN_PASSWORD' });
}
