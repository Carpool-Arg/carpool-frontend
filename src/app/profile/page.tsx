'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { RoleSwithcer } from '@/components/profile/RoleSwitcher';
import { RoleOptions } from '@/components/profile/RoleOptions';
import { Alert } from '@/components/ui/Alert';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [role, setRole] = useState<'pasajero' | 'conductor'>('pasajero');
  const router = useRouter();

  if (!user) return null;

  const isDriver = user.roles?.includes('driver');

  const handleRegisterAsDriver = () => {
    router.push('/register-driver');
  };

  return (
    <>
      <RoleSwithcer role={role} onChange={setRole} />

      {role === 'conductor' && !isDriver ? (
        <div className="mt-6 space-y-3">
          <Alert type="info" message="Aún no estás registrado como conductor.">
            <button
              onClick={handleRegisterAsDriver}
              className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Registrarme como conductor
            </button>
          </Alert>
        </div>
      ) : (
        <RoleOptions
          role={role === 'conductor' ? 'driver' : 'passenger'}
          logout={logout}
        />
      )}
    </>
  );
}
