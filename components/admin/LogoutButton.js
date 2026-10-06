'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button className="btn-ghost w-full" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin/login'); router.refresh(); }}>
      Logout
    </button>
  );
}
