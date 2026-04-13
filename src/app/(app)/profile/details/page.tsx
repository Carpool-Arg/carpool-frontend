import ProfileDetails from '@/modules/profile/components/ProfileDetails';
import { ProfileHeader } from '@/modules/profile/components/ProfileHeader';

export default function ProfileDetailsPage() {
  return (
    <div className='max-w-lg mx-auto'>
      <div className='flex flex-col gap-4'>
        <ProfileHeader />
        <ProfileDetails />
      </div>
    </div>
  );
}
