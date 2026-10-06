import crypto from 'crypto';
import { NextResponse } from 'next/server';

// Uploads one image to Cloudinary and returns its URL (max ~4 MB per image on Vercel)
export async function POST(req) {
  const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
  if (!cloud || !key || !secret) return NextResponse.json({ error: 'Cloudinary keys are missing' }, { status: 500 });
  const fd = await req.formData();
  const file = fd.get('file');
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'punehome';
  const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest('hex');
  const body = new FormData();
  body.append('file', file);
  body.append('api_key', key);
  body.append('timestamp', String(timestamp));
  body.append('folder', folder);
  body.append('signature', signature);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body });
  const j = await r.json();
  if (!r.ok) return NextResponse.json({ error: j.error?.message || 'Upload failed' }, { status: 400 });
  return NextResponse.json({ url: j.secure_url });
}
