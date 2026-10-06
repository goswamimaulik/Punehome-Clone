'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STATUSES, TYPES, CONFIGS } from '@/lib/utils';

export default function ProjectForm({ initial, cities, localities, developers }) {
  const router = useRouter();
  const [f, setF] = useState({ type: 'residential', status: 'Under Construction', configs: [], images: [], amenities: '', published: true, featured: false, ...initial });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const locs = useMemo(() => localities.filter((l) => l.city === f.city), [f.city, localities]);

  async function upload(files, multi) {
    setBusy(true); setErr('');
    const urls = [];
    for (const file of files) {
      const fd = new FormData(); fd.append('file', file);
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const j = await r.json();
      if (!r.ok) { setErr(j.error); break; }
      urls.push(j.url);
    }
    if (urls.length) multi ? set('images', [...(f.images || []), ...urls]) : set('cover', urls[0]);
    setBusy(false);
  }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const body = {
      ...f,
      price: Number(f.price) || 0, areaMin: Number(f.areaMin) || 0, areaMax: Number(f.areaMax) || 0,
      amenities: f.amenities.split(',').map((s) => s.trim()).filter(Boolean),
    };
    const r = await fetch('/api/admin/projects' + (f._id ? '/' + f._id : ''), { method: f._id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) { setErr(j.error || 'Error'); setBusy(false); return; }
    router.push('/admin/projects'); router.refresh();
  }

  const toggleCfg = (c) => set('configs', f.configs.includes(c) ? f.configs.filter((x) => x !== c) : [...f.configs, c]);
  const Sel = ({ k, label, opts, req }) => (
    <div><label className="label">{label}</label>
      <select className="input" required={req} value={f[k] || ''} onChange={(e) => set(k, e.target.value)}>
        <option value="">Select…</option>{opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select></div>
  );

  return (
    <form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-2">
      <div className="md:col-span-2"><label className="label">Project title *</label><input required className="input" value={f.title || ''} onChange={(e) => set('title', e.target.value)} /></div>
      <Sel k="type" label="Property type *" req opts={TYPES.map((t) => ({ v: t, l: t[0].toUpperCase() + t.slice(1) }))} />
      <Sel k="status" label="Property status *" req opts={STATUSES.map((s) => ({ v: s, l: s }))} />
      <div><label className="label">Starting price (₹, full number e.g. 8500000)</label><input type="number" className="input" value={f.price || ''} onChange={(e) => set('price', e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="label">Area min (sq.ft)</label><input type="number" className="input" value={f.areaMin || ''} onChange={(e) => set('areaMin', e.target.value)} /></div>
        <div><label className="label">Area max (sq.ft)</label><input type="number" className="input" value={f.areaMax || ''} onChange={(e) => set('areaMax', e.target.value)} /></div>
      </div>
      <div className="md:col-span-2"><label className="label">Configurations</label>
        <div className="flex flex-wrap gap-2">{CONFIGS.map((c) => (
          <label key={c} className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${f.configs.includes(c) ? 'border-brand bg-brand text-white' : 'bg-white'}`}>
            <input type="checkbox" className="hidden" checked={f.configs.includes(c)} onChange={() => toggleCfg(c)} />{c}
          </label>))}</div></div>
      <Sel k="city" label="City" opts={cities.map((c) => ({ v: c._id, l: c.name }))} />
      <Sel k="locality" label="Locality" opts={locs.map((c) => ({ v: c._id, l: c.name }))} />
      <Sel k="developer" label="Developer" opts={developers.map((c) => ({ v: c._id, l: c.name }))} />
      <div><label className="label">MahaRERA number</label><input className="input" value={f.rera || ''} onChange={(e) => set('rera', e.target.value)} /></div>
      <div className="md:col-span-2"><label className="label">Address</label><input className="input" value={f.address || ''} onChange={(e) => set('address', e.target.value)} /></div>
      <div className="md:col-span-2"><label className="label">Description</label><textarea rows={5} className="input" value={f.description || ''} onChange={(e) => set('description', e.target.value)} /></div>
      <div className="md:col-span-2"><label className="label">Amenities (comma separated)</label><input className="input" placeholder="Gym, Swimming pool, Clubhouse" value={f.amenities} onChange={(e) => set('amenities', e.target.value)} /></div>
      <div><label className="label">Cover image</label><input type="file" accept="image/*" onChange={(e) => e.target.files[0] && upload([e.target.files[0]], false)} />
        {f.cover && <img src={f.cover} alt="" className="mt-2 h-24 rounded object-cover" />}</div>
      <div><label className="label">Gallery images (select many)</label><input type="file" accept="image/*" multiple onChange={(e) => upload([...e.target.files], true)} />
        <div className="mt-2 flex flex-wrap gap-2">{(f.images || []).map((u) => (
          <div key={u} className="relative"><img src={u} alt="" className="h-16 w-20 rounded object-cover" />
            <button type="button" onClick={() => set('images', f.images.filter((x) => x !== u))} className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 text-xs text-white">×</button></div>))}</div></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.published} onChange={(e) => set('published', e.target.checked)} /> Published (visible on website)</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!f.featured} onChange={(e) => set('featured', e.target.checked)} /> Featured</label>
      {err && <p className="text-sm text-red-600 md:col-span-2">{err}</p>}
      <div className="md:col-span-2"><button className="btn" disabled={busy}>{busy ? 'Please wait…' : 'Save project'}</button></div>
    </form>
  );
}
