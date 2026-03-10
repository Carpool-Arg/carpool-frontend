import { Bell, ChevronRight, Lock, MessageSquareShare, ShieldHalf, UserRoundCog, UserStar } from "lucide-react";
import Link from "next/link";


export function ReviewsOptions() {
    const linkClasses = `
        flex items-center justify-between gap-2 px-4 py-3
        rounded-lg transition-colors duration-200
        hover:bg-gray-1 dark:hover:bg-gray-2
        text-sm font-regular text-gray-700 dark:text-gray-200
    `;
    return(
        <div className="flex flex-col gap-3 shadow-md">
        <div>
            <p className='px-6 text-sm mb-0.5 text-white/75'>Reseñas</p>
            <div className="flex flex-col gap-1 p-2 bg-white dark:bg-gray-2/50 rounded-xl">
                <Link href="/settings/account" className={linkClasses}>
                    <div className="flex items-center gap-2">   
                    <UserStar size={18}/>
                    <span>Mi reputación</span>
                    </div>
                    
                    <ChevronRight size={18} />
                </Link>

                <Link href="/reviews/from-me" className={linkClasses}>
                    <div className="flex items-center gap-2">   
                    <MessageSquareShare size={18}/>
                    <span>Mis opiniones</span>
                    </div>
                    
                    <ChevronRight size={18} />
                </Link>
            </div>

            
        </div>
    </div>
  );
}
