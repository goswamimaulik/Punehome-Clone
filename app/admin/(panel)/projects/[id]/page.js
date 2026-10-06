import ProjectForm from '@/components/admin/ProjectForm';
import { db } from '@/lib/db';
import { Project, City, Locality, Developer } from '@/lib/models';

export const dynamic = 'force-dynamic';
const plain = (x) => JSON.parse(JSON.stringify(x));

export default async function Page({ params }) {
  await db();
  const [cities, localities, developers] = await Promise.all([
    City.find().sort('name').lean(), Locality.find().sort('name').lean(), Developer.find().sort('name').lean(),
  ]);
  let initial = {};
  if (params.id !== 'new') {
    const p = plain(await Project.findById(params.id).lean());
    initial = { ...p, amenities: (p.amenities || []).join(', ') };
  }
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{params.id === 'new' ? 'Add project' : 'Edit project'}</h1>
      <ProjectForm initial={initial} cities={plain(cities)} localities={plain(localities)} developers={plain(developers)} />
    </div>
  );
}
