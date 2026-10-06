import { notFound } from 'next/navigation';
import ProjectGrid from '@/components/ProjectGrid';
import { Developer } from '@/lib/models';
import { getBySlug, listProjects } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function DeveloperPage({ params }) {
  const dev = await getBySlug(Developer, params.slug);
  if (!dev) notFound();
  const projects = await listProjects({ developer: dev._id });
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">{dev.name}</h1>
      {dev.description && <p className="mb-4 mt-2 max-w-2xl text-slate-600">{dev.description}</p>}
      <div className="mt-4"><ProjectGrid projects={projects} /></div>
    </div>
  );
}
