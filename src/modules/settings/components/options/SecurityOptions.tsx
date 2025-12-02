import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function SecurityOptions() {
    const linkClasses = `
        flex items-center justify-between gap-2 px-4 py-3
        rounded-lg transition-colors duration-200
        hover:bg-gray-1 dark:hover:bg-gray-2
        text-sm font-medium text-gray-700 dark:text-gray-200
    `;

    return(
        <div className="flex flex-col gap-1 p-2 bg-white dark:bg-gray-2/50 rounded-xl">
            <Link href="/settings/security/two-factor-auth" className={linkClasses}>
                <span>Autenticación en 2 pasos</span>
                <ChevronRight size={18} />
            </Link>

            <Link href="/settings/security/active-sessions" className={linkClasses}>
                <span>Sesiones activas</span>
                <ChevronRight size={18} />
            </Link>

            <Link href="/settings/security/login-activity" className={linkClasses}>
                <span>Actividad de inicio de sesión</span>
                <ChevronRight size={18} />
            </Link>

            <Link href="/settings/security/security-questions" className={linkClasses}>
                <span>Preguntas de seguridad</span>
                <ChevronRight size={18} />
            </Link>

            <Link href="/settings/security/data-download" className={linkClasses}>
                <span>Descargar mis datos</span>
                <ChevronRight size={18} />
            </Link>
        </div>
    );
}
