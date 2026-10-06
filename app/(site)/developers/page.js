import Link from 'next/link';
import { getDevelopers } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Developers' };

export default async function Developers() {
  const list = await getDevelopers();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Developers</h1>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((d) => (
          <Link key={d._id} href={`/developers/${d.slug}`} className="card p-4 hover:shadow">
            {d.logo && <img src={d.logo} alt={d.name} className="mb-2 h-10 object-contain" />}
            <p className="font-semibold">{d.name}</p><p className="text-sm text-slate-500">{d.count} projects</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
