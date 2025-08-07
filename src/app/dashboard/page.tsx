'use client'

import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/authContext'
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';


export default function DashboardPage() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="p-8 flex items-center justify-between">
      <div className='flex flex-col items-start'>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Hola, <strong>{user?.username}</strong>!</p>
      </div>
      <Link href="/home" className="text-white">Home</Link>
      <Button variant="outline" onClick={logout}>Logout</Button>
    </main>
  );
}
