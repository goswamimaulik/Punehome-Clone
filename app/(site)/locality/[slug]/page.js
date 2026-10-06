import { notFound } from 'next/navigation';
import ProjectGrid from '@/components/ProjectGrid';
import { Locality } from '@/lib/models';
import { getBySlug, listProjects } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function LocalityPage({ params }) {
  const loc = await getBySlug(Locality, params.slug);
  if (!loc) notFound();
  const projects = await listProjects({ locality: loc._id });
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Property in {loc.name}</h1>
      <ProjectGrid projects={projects} />
    </div>
  );
}
