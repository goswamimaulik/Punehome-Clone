import Link from 'next/link';
import { notFound } from 'next/navigation';
import EnquiryForm from '@/components/EnquiryForm';
import { getProject } from '@/lib/queries';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const p = await getProject(params.slug);
  return p ? { title: p.title, description: (p.description || '').slice(0, 155) } : {};
}

export default async function ProjectPage({ params }) {
  const p = await getProject(params.slug);
  if (!p) notFound();
  const gallery = [p.cover, ...(p.images || [])].filter(Boolean);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {gallery.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              <img src={gallery[0]} alt={p.title} className="col-span-3 aspect-video w-full rounded-xl object-cover" />
              {gallery.slice(1, 7).map((g, i) => <img key={i} src={g} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />)}
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded bg-brand/10 px-2 py-1 text-xs font-medium text-brand">{p.status}</span>
            <span className="rounded bg-slate-200 px-2 py-1 text-xs capitalize">{p.type}</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold">{p.title}</h1>
          {p.developer && <p className="text-sm text-slate-500">by <Link className="text-brand" href={`/developers/${p.developer.slug}`}>{p.developer.name}</Link></p>}
          <p className="mt-1 text-slate-600">{p.address}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="card p-4"><p className="text-xs text-slate-500">Price</p><p className="font-semibold">{formatPrice(p.price)}{p.price ? ' onwards' : ''}</p></div>
            <div className="card p-4"><p className="text-xs text-slate-500">Configuration</p><p className="font-semibold">{(p.configs || []).join(', ') || '—'}</p></div>
            <div className="card p-4"><p className="text-xs text-slate-500">Area</p><p className="font-semibold">{p.areaMin ? `${p.areaMin}${p.areaMax && p.areaMax !== p.areaMin ? '–' + p.areaMax : ''} sq.ft` : '—'}</p></div>
          </div>
          {p.rera && <p className="mt-3 text-sm">MahaRERA No: <b>{p.rera}</b></p>}
          {p.description && <><h2 className="mt-6 text-xl font-semibold">About the project</h2><p className="mt-2 whitespace-pre-line text-slate-700">{p.description}</p></>}
          {p.amenities?.length > 0 && (
            <>
              <h2 className="mt-6 text-xl font-semibold">Amenities</h2>
              <div className="mt-2 flex flex-wrap gap-2">{p.amenities.map((a) => <span key={a} className="rounded-full border bg-white px-3 py-1 text-sm">{a}</span>)}</div>
            </>
          )}
        </div>
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <EnquiryForm projectId={p._id} title={`Interested in ${p.title}?`} />
        </aside>
      </div>
    </div>
  );
}
