'use client'

import PasswordForm from "@/components/password/PasswordForm";
import { unlockAccount } from "@/services/userService";

export default function UnlockAccountPage(){
    return (
        <PasswordForm
            title="Recuperá tu cuenta"
            successTitle="¡Cuenta recuperada correctamente!"
            successMessage="Se actualizó tu contraseña, puedes volver a intentar iniciar sesión"
            onSubmit={unlockAccount}
        />
    );
}