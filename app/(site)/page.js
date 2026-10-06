import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import ProjectGrid from '@/components/ProjectGrid';
import { listProjects, getCities, getDevelopers } from '@/lib/queries';
import { SITE, TESTIMONIALS } from '@/lib/site';

export const dynamic = 'force-dynamic';

const FEATURES = [
  ['Trusted by buyers', 'Reliable, transparent real-estate services for home-buyers across the city.'],
  ['Wide range of properties', 'Residential and commercial options across top locations, all in one place.'],
  ['Financing made easy', 'Home-loan assistance and an EMI calculator to plan your purchase.'],
  ['Explore neighborhoods', 'Find the best areas to live and invest in.'],
];

export default async function Home() {
  const [latest, cities, developers] = await Promise.all([listProjects({}, 6), getCities(), getDevelopers()]);
  return (
    <>
      <section className="bg-gradient-to-br from-brand to-slate-900 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm opacity-80">{SITE.tagline}</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold md:text-5xl">Find your perfect property in Pune.</h1>
          <p className="mt-3 max-w-xl opacity-90">Discover verified residential and commercial properties across Pune&apos;s top locations.</p>
          <div className="mt-6 rounded-xl bg-white p-3 text-slate-900"><SearchForm cities={cities} /></div>
          <div className="mt-6 flex gap-8 text-sm">
            <div><p className="text-2xl font-bold">0%</p>Brokerage</div>
            <div><p className="text-2xl font-bold">100%</p>RERA-verified</div>
            <div><p className="text-2xl font-bold">{latest.length ? '50+' : '—'}</p>Projects</div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(([t, d]) => (
          <div key={t} className="card p-5"><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm text-slate-600">{d}</p></div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="mb-4 flex items-end justify-between">
          <div><h2 className="text-2xl font-bold">Newly Added</h2><p className="text-sm text-slate-500">The latest projects on {SITE.name}</p></div>
          <Link href="/projects" className="text-sm font-medium text-brand">See all →</Link>
        </div>
        <ProjectGrid projects={latest} />
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <h2 className="mb-4 text-2xl font-bold">Explore by city</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cities.map((c) => (
            <Link key={c._id} href={`/city/${c.slug}`} className="card p-4 hover:shadow">
              <p className="font-semibold">{c.name}</p><p className="text-sm text-slate-500">{c.count} projects</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Built by developers you trust</h2>
          <Link href="/developers" className="text-sm font-medium text-brand">All developers →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {developers.slice(0, 8).map((d) => (
            <Link key={d._id} href={`/developers/${d.slug}`} className="card p-4 hover:shadow">
              <p className="font-semibold">{d.name}</p><p className="text-sm text-slate-500">{d.count} projects</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <h2 className="mb-4 text-2xl font-bold">What our customers say</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card p-5">
              <p className="text-amber-500">★★★★★</p>
              <p className="mt-2 text-sm text-slate-700">“{t.text}”</p>
              <p className="mt-3 text-sm font-semibold">{t.name}</p><p className="text-xs text-slate-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4">
        <div className="rounded-2xl bg-brand p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Start your property journey with {SITE.name}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm opacity-90">Expert guidance and personal attention at every step.</p>
          <Link href="/contact" className="mt-4 inline-block rounded-lg bg-white px-5 py-2 font-semibold text-brand">Talk to an expert</Link>
        </div>
      </section>
    </>
  );
}
