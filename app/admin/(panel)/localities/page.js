import Crud from '@/components/admin/Crud';
import { db } from '@/lib/db';
import { City } from '@/lib/models';

export const dynamic = 'force-dynamic';

export default async function Page() {
  await db();
  const cities = (await City.find().sort('name').lean()).map((c) => ({ value: String(c._id), label: c.name }));
  return <Crud model="localities" title="Localities" fields={[{ key: 'name', label: 'Locality name', required: true }, { key: 'city', label: 'City', type: 'select', options: cities, required: true }, { key: 'active', label: 'Active', type: 'checkbox' }]} columns={[{ key: 'name', label: 'Locality' }, { key: 'city.name', label: 'City' }, { key: 'active', label: 'Active' }]} />;
}
