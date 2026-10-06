'use client';
import { useEffect, useState } from 'react';

const get = (row, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), row);

// Generic add / edit / delete table. Used for Cities, Localities, Developers, Users.
export default function Crud({ model, title, fields, columns }) {
  const blank = () => Object.fromEntries(fields.map((f) => [f.key, f.type === 'checkbox' ? true : '']));
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(blank());
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => { const r = await fetch(`/api/admin/${model}`); if (r.ok) setRows(await r.json()); };
  useEffect(() => { load(); }, []);

  async function save(e) {
    e.preventDefault(); setErr('');
    const r = await fetch(`/api/admin/${model}${editing ? '/' + editing : ''}`, {
      method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    const j = await r.json();
    if (!r.ok) return setErr(j.error || 'Error');
    setForm(blank()); setEditing(null); load();
  }

  function edit(row) {
    setEditing(row._id);
    const f = {};
    fields.forEach((x) => { let v = row[x.key]; if (v && typeof v === 'object') v = v._id; f[x.key] = x.type === 'password' ? '' : v ?? ''; });
    setForm(f);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function del(id) {
    if (!confirm('Delete this record?')) return;
    const r = await fetch(`/api/admin/${model}/${id}`, { method: 'DELETE' });
    if (!r.ok) alert((await r.json()).error);
    load();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{title}</h1>
      <form onSubmit={save} className="card mb-6 grid gap-3 p-4 md:grid-cols-4">
        {fields.map((f) => (
          <div key={f.key} className={f.type === 'checkbox' ? 'flex items-end gap-2 pb-2' : ''}>
            {f.type === 'checkbox' ? (
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })} />{f.label}</label>
            ) : (
              <>
                <label className="label">{f.label}</label>
                {f.type === 'select' ? (
                  <select className="input" required={f.required} value={form[f.key] || ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}>
                    <option value="">Select…</option>
                    {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input className="input" type={f.type || 'text'} required={f.required && !(f.type === 'password' && editing)} placeholder={f.type === 'password' && editing ? 'Leave blank to keep' : ''} value={form[f.key] ?? ''} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
                )}
              </>
            )}
          </div>
        ))}
        <div className="flex items-end gap-2">
          <button className="btn">{editing ? 'Update' : 'Add'}</button>
          {editing && <button type="button" className="btn-ghost" onClick={() => { setEditing(null); setForm(blank()); }}>Cancel</button>}
        </div>
        {err && <p className="text-sm text-red-600 md:col-span-4">{err}</p>}
      </form>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>{columns.map((c) => <th key={c.key} className="px-4 py-2">{c.label}</th>)}<th /></tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r._id}>
                {columns.map((c) => { const v = get(r, c.key); return <td key={c.key} className="px-4 py-2">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : v}</td>; })}
                <td className="space-x-2 whitespace-nowrap px-4 py-2 text-right">
                  <button className="text-brand" onClick={() => edit(r)}>Edit</button>
                  <button className="text-red-600" onClick={() => del(r._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="px-4 py-6 text-center text-slate-500" colSpan={columns.length + 1}>Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
