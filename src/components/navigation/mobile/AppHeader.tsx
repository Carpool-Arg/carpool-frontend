'use client'

import { getMatchingHeaderPath, HEADER_TITLES } from '@/constants/publicPaths';
import { ChevronLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AppHeaderProps {
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const AppHeader = ({ showBack, rightAction }: AppHeaderProps) => {
  const pathname = usePathname();

  const matchingPath = getMatchingHeaderPath(pathname);
  const title = matchingPath ? HEADER_TITLES[matchingPath] : 'App';

  return (
    <div className="flex items-center justify-between h-10 px-4 bg-dark-5 border-b border-gray-2 dark:border-gray-2">
      {showBack ? (
        <button onClick={() => history.back()} className="text-gray-700 dark:text-gray-200 cursor-pointer">
          <ChevronLeft size={16}/>
        </button>
      ) : (
        <div className="w-6" /> // espacio para alinear
      )}

      <h1 className=" font-semibold text-gray-900 dark:text-white">{title}</h1>

      <div>{rightAction}</div>
    </div>
  );
};
