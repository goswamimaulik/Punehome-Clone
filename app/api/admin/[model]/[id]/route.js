import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUser, bcrypt } from '@/lib/auth';
import { CFG } from '@/lib/crud';
import { slugify } from '@/lib/utils';

async function guard(params) {
  const cfg = CFG[params.model];
  const user = await getUser();
  if (!cfg || !user || !cfg.write.includes(user.role)) return {};
  return { cfg, user };
}

export async function PUT(req, { params }) {
  const { cfg, user } = await guard(params);
  if (!cfg) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  await db();
  const body = await req.json();
  try {
    if (body.addNote) {
      await cfg.M.findByIdAndUpdate(params.id, { $push: { notes: { text: body.addNote, by: user.name, at: new Date() } } });
      return NextResponse.json({ ok: true });
    }
    for (const k of ['_id', '__v', 'createdAt', 'updatedAt']) delete body[k];
    for (const k of Object.keys(body)) if (body[k] === '') body[k] = null;
    if (cfg.slug && body.slug) body.slug = slugify(body.slug);
    if (params.model === 'users') {
      if (body.password) body.password = await bcrypt.hash(body.password, 10);
      else delete body.password;
    }
    await cfg.M.findByIdAndUpdate(params.id, body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e.code === 11000 ? 'This name/email already exists' : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { cfg, user } = await guard(params);
  if (!cfg) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  if (params.model === 'users' && params.id === user.id) return NextResponse.json({ error: 'You cannot delete yourself' }, { status: 400 });
  if (params.model === 'leads' && user.role === 'agent') return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  await db();
  await cfg.M.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
