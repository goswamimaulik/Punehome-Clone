import Crud from '@/components/admin/Crud';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const ROLES = [{ value: 'admin', label: 'Admin (everything)' }, { value: 'manager', label: 'Manager (projects + leads)' }, { value: 'agent', label: 'Agent (own leads only)' }];

export default async function Page() {
  const u = await getUser();
  if (u?.role !== 'admin') redirect('/admin');
  return <Crud model="users" title="Users" fields={[{ key: 'name', label: 'Name', required: true }, { key: 'email', label: 'Email', type: 'email', required: true }, { key: 'password', label: 'Password', type: 'password', required: true }, { key: 'role', label: 'Role', type: 'select', options: ROLES, required: true }, { key: 'active', label: 'Active', type: 'checkbox' }]} columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'active', label: 'Active' }]} />;
}
