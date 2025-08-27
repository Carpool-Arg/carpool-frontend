import { ChevronRight } from "lucide-react";
import Link from "next/link";


export function SettingsOptions() {
    const linkClasses = `
        flex items-center justify-between gap-2 px-4 py-3
        rounded-lg transition-colors duration-200
        hover:bg-gray-1 dark:hover:bg-gray-2
        text-sm font-medium text-gray-700 dark:text-gray-200
    `;
    return(
        <div className="flex flex-col gap-1 p-2 bg-white dark:bg-gray-2/50 rounded-xl">
            <Link href="/settings/account" className={linkClasses}>
                <span>Cuenta</span>
                <ChevronRight size={18} />
            </Link>

            <Link href="/settings/security" className={linkClasses}>
                <span>Seguridad</span>
                <ChevronRight size={18} />
            </Link>

            <Link href="/settings/notifications" className={linkClasses}>
                <span>Notificaciones</span>
                <ChevronRight size={18} />
            </Link>

            <Link href="/settings/privacy" className={linkClasses}>
                <span>Privacidad</span>
                <ChevronRight size={18} />
            </Link>

        </div>
  );
}
