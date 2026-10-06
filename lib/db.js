import mongoose from 'mongoose';

const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

export async function db() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is missing in environment variables');
  if (cached.conn) return cached.conn;
  cached.promise = cached.promise || mongoose.connect(process.env.MONGODB_URI);
  cached.conn = await cached.promise;
  return cached.conn;
}
