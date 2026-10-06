import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUser, bcrypt } from '@/lib/auth';
import { CFG } from '@/lib/crud';
import { slugify } from '@/lib/utils';

export async function GET(req, { params }) {
  const cfg = CFG[params.model];
  const user = await getUser();
  if (!cfg || !user) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  await db();
  const filter = params.model === 'leads' && user.role === 'agent' ? { assignedTo: user.id } : {};
  let q = cfg.M.find(filter).sort('-createdAt').limit(1000);
  if (cfg.select) q = q.select(cfg.select);
  if (cfg.pop) q = q.populate(cfg.pop);
  return NextResponse.json(await q.lean());
}

export async function POST(req, { params }) {
  const cfg = CFG[params.model];
  const user = await getUser();
  if (!cfg || !user || !cfg.write.includes(user.role)) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  await db();
  const body = await req.json();
  for (const k of Object.keys(body)) if (body[k] === '') delete body[k];
  if (cfg.slug) body.slug = slugify(body.slug || body.name || body.title);
  if (params.model === 'users') {
    if (!body.password) return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    body.password = await bcrypt.hash(body.password, 10);
  }
  try {
    const doc = await cfg.M.create(body);
    return NextResponse.json({ ok: true, id: doc._id });
  } catch (e) {
    const msg = e.code === 11000 ? 'This name/email already exists' : e.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
