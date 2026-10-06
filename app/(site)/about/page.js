import { SITE } from '@/lib/site';

export const metadata = { title: 'About Us' };

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">About {SITE.name}</h1>
      <p className="mt-4 text-slate-700">{SITE.name} helps buyers find verified residential and commercial properties across Pune&apos;s top locations — transparent listings, direct enquiries and a hassle-free home-buying journey.</p>
      <p className="mt-3 text-slate-700">Edit this page in <code>app/(site)/about/page.js</code> to add your own company story.</p>
    </div>
  );
}
