import { z } from "zod";

export const profileSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']).optional(),
  phone: z.string()
  .min(7, 'El teléfono debe tener al menos 7 dígitos')
  .regex(/^[0-9+\-\s()]+$/, 'El número de teléfono debe contener únicamente números, guiones, signos + y espacios.')
  .max(25, 'El teléfono no puede tener más de 25 dígitos'),
  name: z.string().optional(),
  lastname: z.string().optional(),
  dni: z.string().optional(),
  email: z.string().optional(),
  birthDate: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileSchema>;