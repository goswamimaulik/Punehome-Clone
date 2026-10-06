import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Lead } from '@/lib/models';

// Public enquiry form submits here
export async function POST(req) {
  const b = await req.json();
  const name = (b.name || '').trim().slice(0, 100);
  const phone = (b.phone || '').trim().slice(0, 20);
  if (!name || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Please enter a valid name and phone number' }, { status: 400 });
  }
  await db();
  await Lead.create({
    name, phone,
    email: (b.email || '').slice(0, 120),
    message: (b.message || '').slice(0, 1000),
    project: b.project || undefined,
  });
  return NextResponse.json({ ok: true });
}
