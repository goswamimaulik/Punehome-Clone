import { notFound } from 'next/navigation';
import ProjectGrid from '@/components/ProjectGrid';
import { City } from '@/lib/models';
import { getBySlug, listProjects } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function CityPage({ params }) {
  const city = await getBySlug(City, params.slug);
  if (!city) notFound();
  const projects = await listProjects({ city: city._id });
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Projects in {city.name}</h1>
      <ProjectGrid projects={projects} />
    </div>
  );
}
