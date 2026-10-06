import Crud from '@/components/admin/Crud';

export default function Page() {
  return <Crud model="developers" title="Developers" fields={[{ key: 'name', label: 'Developer name', required: true }, { key: 'logo', label: 'Logo URL (optional)' }, { key: 'description', label: 'Short description' }, { key: 'active', label: 'Active', type: 'checkbox' }]} columns={[{ key: 'name', label: 'Developer' }, { key: 'slug', label: 'URL slug' }, { key: 'active', label: 'Active' }]} />;
}
