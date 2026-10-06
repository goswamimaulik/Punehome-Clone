import { db } from '@/lib/db';
import { Project, Lead, City } from '@/lib/models';
import { getUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  await db();
  const u = await getUser();
  const mine = u.role === 'agent' ? { assignedTo: u.id } : {};
  const [projects, leads, newLeads, cities, recent] = await Promise.all([
    Project.countDocuments(), Lead.countDocuments(mine), Lead.countDocuments({ ...mine, status: 'New' }), City.countDocuments(),
    Lead.find(mine).sort('-createdAt').limit(6).populate('project', 'title').lean(),
  ]);
  const stats = [['Projects', projects], ['Total leads', leads], ['New leads', newLeads], ['Cities', cities]];
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([l, v]) => <div key={l} className="card p-5"><p className="text-sm text-slate-500">{l}</p><p className="text-3xl font-bold">{v}</p></div>)}
      </div>
      <h2 className="mb-2 mt-8 font-semibold">Recent leads</h2>
      <div className="card divide-y">
        {recent.length === 0 && <p className="p-4 text-sm text-slate-500">No leads yet.</p>}
        {recent.map((l) => (
          <div key={String(l._id)} className="flex flex-wrap justify-between gap-2 p-3 text-sm">
            <span className="font-medium">{l.name} · {l.phone}</span>
            <span className="text-slate-500">{l.project?.title || 'General enquiry'} · {l.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
