import { R2_PUBLIC_PREFIX } from '@/constants/imagesR2';
import { useAuth } from '@/contexts/authContext';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps{
  role: string
}


export function ProfileHeader({role}:ProfileHeaderProps) {

  const { user, prevImage } = useAuth();
  const imageToShow = prevImage || user?.profileImage;

  return (
    <div className="flex items-top justify-center gap-4 px-4">

      <div className="relative w-20 h-20 rounded-full overflow-hidden">
        <Image
          src={imageToShow || `${R2_PUBLIC_PREFIX}/default-profile.png`}
          alt="Foto de perfil"
          fill
          className="object-cover"
        />
      </div>
      <div className=''>
        <h2 className="text-xl font-semibold text-gray-2 mt-2 dark:text-gray-1">
          {user?.username}
        </h2>
        <p className="text-sm inline-flex items-center gap-1 bg-gray-2 text-gray-1/75 rounded px-2">
          <span>
            <Star size={12} fill="currentColor" />
          </span>
          {role == 'conductor' ? (user?.driverRating ? user.driverRating : "0") : user?.passengerRating}
        </p>
      </div>

      
    </div>
  );
}