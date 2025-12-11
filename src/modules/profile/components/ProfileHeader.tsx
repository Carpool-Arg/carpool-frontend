import { R2_PUBLIC_PREFIX } from '@/constants/imagesR2';
import { useAuth } from '@/contexts/authContext';
import Image from 'next/image';

export function ProfileHeader() {

  const { user, prevImage } = useAuth();
  const imageToShow = prevImage || user?.profileImage;

  return (
    <div className="flex flex-col items-center gap-2">

      <div className="relative w-32 h-32 rounded-full overflow-hidden">
        <Image
          src={imageToShow || `${R2_PUBLIC_PREFIX}/default-profile.png`}
          alt="Foto de perfil"
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>

      <h2 className="text-xl font-semibold text-gray-2 dark:text-gray-1">
        {user?.username}
      </h2>
    </div>
  );
}

