import { z } from "zod";

export const emailSchema = z
  .string()
    .email('Ingresa un email válido')
    .min(1, 'El email es obligatorio')
    .max(75, 'El email de usuario no puede tener más de 75 caracteres')


export const updateEmailSchema = z
    .object({
        email: emailSchema,
    })

export type UpdateEmailData = z.infer<typeof updateEmailSchema>;

    