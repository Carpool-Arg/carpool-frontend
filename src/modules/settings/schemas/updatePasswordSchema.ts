import { z } from "zod";
import { passwordSchema } from "./passwordSchema";

// Cambiar contraseña (logueado): oldPassword + password + confirmPassword
export const updatePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string(), 
  })
  .refine((data) => data.confirmNewPassword.length > 0, {
    message: "Confirma tu contraseña",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "La nueva contraseña no puede ser igual a la anterior",
    path: ["newPassword"],
  });

export type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;  