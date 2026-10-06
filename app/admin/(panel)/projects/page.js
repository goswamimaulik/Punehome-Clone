'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { STATUSES, TYPES, formatPrice } from '@/lib/utils';

export default function ProjectsAdmin() {
  const [rows, setRows] = useState([]);
  const [st, setSt] = useState('');
  const [ty, setTy] = useState('');
  const [q, setQ] = useState('');

  const load = async () => { const r = await fetch('/api/admin/projects'); if (r.ok) setRows(await r.json()); };
  useEffect(() => { load(); }, []);

  async function del(id) {
    if (!confirm('Delete this project?')) return;
    await fetch('/api/admin/projects/' + id, { method: 'DELETE' });
    load();
  }

  const shown = rows.filter((r) => (!st || r.status === st) && (!ty || r.type === ty) && r.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Projects ({shown.length})</h1>
        <Link href="/admin/projects/new" className="btn">+ Add project</Link>
      </div>
      <div className="mb-3 grid gap-2 md:grid-cols-4">
        <input className="input" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={ty} onChange={(e) => setTy(e.target.value)}><option value="">All types</option>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        <select className="input" value={st} onChange={(e) => setSt(e.target.value)}><option value="">All status</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-2">Project</th><th>Type</th><th>Status</th><th>Price</th><th>Location</th><th>Live</th><th /></tr></thead>
          <tbody className="divide-y">
            {shown.map((r) => (
              <tr key={r._id}>
                <td className="px-4 py-2 font-medium">{r.title}</td>
                <td className="capitalize">{r.type}</td><td>{r.status}</td><td>{formatPrice(r.price)}</td>
                <td>{r.locality?.name || r.city?.name || '—'}</td><td>{r.published ? 'Yes' : 'Hidden'}</td>
                <td className="space-x-2 whitespace-nowrap px-4 text-right">
                  <Link className="text-brand" href={'/admin/projects/' + r._id}>Edit</Link>
                  <button className="text-red-600" onClick={() => del(r._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={7} className="px-4 py-6 text-center text-slate-500">No projects yet. Click “Add project”.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
