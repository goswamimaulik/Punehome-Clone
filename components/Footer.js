import Link from 'next/link';
import { SITE } from '@/lib/site';
import { getCities } from '@/lib/queries';

export default async function Footer() {
  const cities = (await getCities().catch(() => [])).slice(0, 12);
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{SITE.name}</p>
          <p className="mt-2 text-sm">{SITE.tagline}</p>
          <p className="mt-2 text-sm">{SITE.email} · {SITE.phone}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Explore</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/projects">All Projects</Link></li>
            <li><Link href="/developers">Developers</Link></li>
            <li><Link href="/calculator/emi-calculator-homeloan">EMI Calculator</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Cities we serve</p>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-sm">
            {cities.map((c) => <li key={c._id}><Link href={`/city/${c.slug}`}>{c.name}</Link></li>)}
          </ul>
        </div>
      </div>
      <p className="border-t border-slate-700 py-4 text-center text-xs">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
    </footer>
  );
}
