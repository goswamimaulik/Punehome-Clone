import SearchForm from '@/components/SearchForm';
import ProjectGrid from '@/components/ProjectGrid';
import { searchProjects, getCities } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Projects' };

export default async function Projects({ searchParams }) {
  const [projects, cities] = await Promise.all([searchProjects(searchParams), getCities()]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Projects in Pune <span className="text-base font-normal text-slate-500">({projects.length})</span></h1>
      <div className="card mb-6 p-3"><SearchForm cities={cities} values={searchParams} compact /></div>
      <ProjectGrid projects={projects} />
    </div>
  );
}
