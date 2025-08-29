import { z } from "zod";

// Regla reutilizable para una contraseña
export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(255, "La contraseña no puede tener más de 255 caracteres")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
  );


// Cambiar contraseña (logueado): oldPassword + password + confirmPassword
export const changePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
   message: "La nueva contraseña no puede ser igual a la anterior",
   path: ["password"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

// ✅ Reset password (con token por email): solo password + confirmPassword
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
