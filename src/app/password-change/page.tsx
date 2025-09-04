'use client'

import PasswordForm from "@/components/password/PasswordForm";
import { resetPassword } from "@/services/userService";

export default function PasswordChangePage(){
    return(
        <PasswordForm
            title="Cambiá tu contraseña"
            successTitle="¡Contraseña actualizada!"
            successMessage="Se actualizó tu contraseña, puedes volver a intentar iniciar sesión"
            onSubmit={resetPassword} 
        />
    )
}