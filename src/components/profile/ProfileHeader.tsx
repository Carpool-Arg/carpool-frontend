import { User as UserIcon } from 'lucide-react';
import { User } from "@/types/user";
import Image from 'next/image';


export function ProfileHeader({ user }: { user: User }) {
  const hasImage = !!user.imageUrl;

  return (
    <div className="flex flex-col items-center gap-2">
      
      {hasImage ? (
        <Image
          src={user.imageUrl||''}
          alt="Foto de perfil"
          width={96}    // 24 * 4 (px) si usás Tailwind w-24 (6rem = 96px)
          height={96}
          className="rounded-full object-cover"
          priority={true}  // opcional, si querés que cargue rápido
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-1 flex items-center justify-center">
          <UserIcon className="w-12 h-12 text-gray-2/50" />
        </div>
      )}
      <h2 className="text-xl font-semibold text-gray-2">{user.username}</h2>
    </div>
  );
}
