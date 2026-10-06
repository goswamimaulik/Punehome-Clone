'use client';
import { useEffect, useState } from 'react';
import { LEAD_STATUSES } from '@/lib/utils';

const J = { 'Content-Type': 'application/json' };

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('');
  const [open, setOpen] = useState(null);
  const [note, setNote] = useState('');

  const load = async () => { const r = await fetch('/api/admin/leads'); if (r.ok) setLeads(await r.json()); };
  useEffect(() => { load(); fetch('/api/admin/users').then((r) => r.ok ? r.json() : []).then(setUsers); }, []);

  const patch = async (id, data) => { await fetch('/api/admin/leads/' + id, { method: 'PUT', headers: J, body: JSON.stringify(data) }); load(); };
  const del = async (id) => { if (confirm('Delete this lead?')) { await fetch('/api/admin/leads/' + id, { method: 'DELETE' }); load(); } };
  const count = (s) => leads.filter((l) => l.status === s).length;
  const shown = leads.filter((l) => !tab || l.status === tab);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Leads (CRM)</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setTab('')} className={`rounded-full border px-3 py-1 text-sm ${!tab ? 'bg-brand text-white' : 'bg-white'}`}>All ({leads.length})</button>
        {LEAD_STATUSES.map((s) => <button key={s} onClick={() => setTab(s)} className={`rounded-full border px-3 py-1 text-sm ${tab === s ? 'bg-brand text-white' : 'bg-white'}`}>{s} ({count(s)})</button>)}
      </div>
      <div className="space-y-3">
        {shown.map((l) => (
          <div key={l._id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{l.name} <a className="ml-2 text-sm font-normal text-brand" href={'tel:' + l.phone}>{l.phone}</a></p>
                <p className="text-sm text-slate-500">{l.email} {l.project?.title ? '· ' + l.project.title : '· General enquiry'} · {new Date(l.createdAt).toLocaleString('en-IN')}</p>
                {l.message && <p className="mt-1 text-sm">“{l.message}”</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <select className="input !w-auto" value={l.status} onChange={(e) => patch(l._id, { status: e.target.value })}>{LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                <select className="input !w-auto" value={l.assignedTo?._id || ''} onChange={(e) => patch(l._id, { assignedTo: e.target.value })}>
                  <option value="">Unassigned</option>{users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
                <button className="btn-ghost" onClick={() => setOpen(open === l._id ? null : l._id)}>Notes ({l.notes?.length || 0})</button>
                <button className="btn-ghost text-red-600" onClick={() => del(l._id)}>Delete</button>
              </div>
            </div>
            {open === l._id && (
              <div className="mt-3 border-t pt-3">
                {(l.notes || []).map((n, i) => <p key={i} className="text-sm"><span className="text-slate-500">{new Date(n.at).toLocaleString('en-IN')} · {n.by}:</span> {n.text}</p>)}
                <div className="mt-2 flex gap-2">
                  <input className="input" placeholder="Add a follow-up note…" value={note} onChange={(e) => setNote(e.target.value)} />
                  <button className="btn" onClick={async () => { if (note.trim()) { await patch(l._id, { addNote: note }); setNote(''); } }}>Add</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {shown.length === 0 && <p className="card p-6 text-center text-slate-500">No leads here yet.</p>}
      </div>
    </div>
  );
}
