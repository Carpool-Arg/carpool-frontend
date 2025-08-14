'use client';

import { useAuth } from '@/contexts/authContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto">
      <div className='md:py-8'>
        <ProfileHeader user={user} />
        <div className="mt-6">{children}</div>
      </div>
      
    </div>
  );
}
