'use client'
import PasswordForm from "@/components/password/PasswordForm";
import { ResetPasswordData } from "@/schemas/password/passwordSchema";
import { resetPassword } from "@/services/userService";

export default function PasswordChangePage() {
  const handleResetPassword = async (data: ResetPasswordData) => {
    return await resetPassword(data);
  };

  return (
    <PasswordForm
      title="Cambiá tu contraseña"
      successTitle="¡Contraseña actualizada!"
      successMessage="Se actualizó tu contraseña, puedes volver a intentar iniciar sesión"
      onSubmit={handleResetPassword}
    />
  );
}