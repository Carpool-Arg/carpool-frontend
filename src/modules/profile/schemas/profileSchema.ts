import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().optional(),
  lastname: z.string().optional(),
  dni: z.string().optional(),
  email: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']),
  phone: z
  .string()
  .regex(/^\d+$/, 'El número de teléfono solo puede contener números')
  .min(8, 'Número demasiado corto')
  .max(15, 'Número demasiado largo'),
});

export type ProfileData = z.infer<typeof profileSchema>;