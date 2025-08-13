import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email('Correo inválido'),
  gender: z.enum(['Masculino', 'Femenino', 'Otro']).optional(),
  phone: z.string().min(8, 'Número demasiado corto').max(15, 'Número demasiado largo'),
});