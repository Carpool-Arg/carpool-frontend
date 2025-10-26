import { User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';


export function ProfileHeader() {
  const { user, prevImage } = useAuth();

  const imageToShow = prevImage || user?.profileImage;

  return (
    <div className="flex flex-col items-center gap-2">
      {imageToShow ? (
        <img
          src={imageToShow}
          alt="Foto de perfil"
          width={96}
          height={96}
          className="rounded-full object-cover w-32 h-32"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-1 flex items-center justify-center">
          <UserIcon className="w-12 h-12 text-gray-2/50" />
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-2 dark:text-gray-1">{user?.username}</h2>
    </div>
  );
}
