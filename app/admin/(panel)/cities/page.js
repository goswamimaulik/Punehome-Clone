import Crud from '@/components/admin/Crud';

export default function Page() {
  return <Crud model="cities" title="Cities" fields={[{ key: 'name', label: 'City name', required: true }, { key: 'active', label: 'Active', type: 'checkbox' }]} columns={[{ key: 'name', label: 'City' }, { key: 'slug', label: 'URL slug' }, { key: 'active', label: 'Active' }]} />;
}
