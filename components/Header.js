import Link from 'next/link';
import { SITE } from '@/lib/site';

const LINKS = [
  ['/projects', 'Projects'],
  ['/developers', 'Developers'],
  ['/calculator/emi-calculator-homeloan', 'EMI Calculator'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand">{SITE.name}</Link>
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-slate-700">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-brand">{label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
