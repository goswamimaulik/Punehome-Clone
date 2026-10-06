import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function ProjectCard({ p }) {
  const area = p.areaMin ? ` · ${p.areaMin}${p.areaMax && p.areaMax !== p.areaMin ? '–' + p.areaMax : ''} sq.ft` : '';
  return (
    <Link href={`/project/${p.slug}`} className="card block overflow-hidden transition hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-slate-200">
        {p.cover && <img src={p.cover} alt={p.title} loading="lazy" className="h-full w-full object-cover" />}
        <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-xs font-medium">{p.status}</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{p.title}</h3>
        <p className="font-semibold text-brand">{formatPrice(p.price)}{p.price ? ' onwards' : ''}</p>
        <p className="line-clamp-1 text-sm text-slate-500">
          {p.locality?.name || p.city?.name}{p.developer ? ` · by ${p.developer.name}` : ''}
        </p>
        <p className="mt-1 text-sm">{(p.configs || []).join(', ')}{area}</p>
      </div>
    </Link>
  );
}
