import { z } from "zod";

const changePasswordBaseSchema = z.object({  
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(255, 'La contraseña no puede tener más de 255 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  confirmPassword: z
    .string()
    .min(1, 'Confirma tu contraseña')
})

export const changePasswordSchema = changePasswordBaseSchema.refine(
  (data) => data.password === data.confirmPassword, 
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
  }
)


export type ChangePasswordData = z.infer<typeof changePasswordSchema>