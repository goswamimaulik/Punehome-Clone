import Link from 'next/link';
import { getUser } from '@/lib/auth';
import LogoutButton from '@/components/admin/LogoutButton';

const NAV = [
  ['/admin', 'Dashboard', ['admin', 'manager', 'agent']],
  ['/admin/projects', 'Projects', ['admin', 'manager']],
  ['/admin/leads', 'Leads (CRM)', ['admin', 'manager', 'agent']],
  ['/admin/cities', 'Cities', ['admin', 'manager']],
  ['/admin/localities', 'Localities', ['admin', 'manager']],
  ['/admin/developers', 'Developers', ['admin', 'manager']],
  ['/admin/users', 'Users', ['admin']],
];

export default async function PanelLayout({ children }) {
  const user = await getUser();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b bg-white p-4 md:w-56 md:border-b-0 md:border-r">
        <p className="text-lg font-bold text-brand">Admin Panel</p>
        <p className="mb-3 text-xs text-slate-500">{user?.name} · {user?.role}</p>
        <nav className="flex flex-wrap gap-1 md:flex-col">
          {NAV.filter(([, , roles]) => roles.includes(user?.role)).map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">{label}</Link>
          ))}
          <Link href="/" target="_blank" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">View website ↗</Link>
        </nav>
        <div className="mt-4"><LogoutButton /></div>
      </aside>
      <main className="flex-1 overflow-x-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
