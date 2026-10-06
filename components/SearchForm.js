import { TYPES, CONFIGS, STATUSES } from '@/lib/utils';

// Plain GET form -> /projects?type=..&city=..  (no JavaScript needed)
export default function SearchForm({ cities, values = {}, compact = false }) {
  return (
    <form action="/projects" className={`grid gap-2 ${compact ? 'md:grid-cols-6' : 'md:grid-cols-5'}`}>
      <input name="q" defaultValue={values.q} placeholder="Search project name" className="input" />
      <select name="type" defaultValue={values.type || ''} className="input">
        <option value="">All types</option>
        {TYPES.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}
      </select>
      <select name="city" defaultValue={values.city || ''} className="input">
        <option value="">All locations</option>
        {cities.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}
      </select>
      <select name="bhk" defaultValue={values.bhk || ''} className="input">
        <option value="">Any configuration</option>
        {CONFIGS.map((c) => <option key={c}>{c}</option>)}
      </select>
      {compact && (
        <select name="status" defaultValue={values.status || ''} className="input">
          <option value="">Any status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      )}
      <button className="btn">Search</button>
    </form>
  );
}
