import { z } from "zod";

export const profileSchema = z.object({
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']).optional(),
  phone: z.string()
  .min(7, 'El teléfono debe tener al menos 7 dígitos')
  .regex(/^[0-9+\-\s()]+$/, 'El número de teléfono debe contener únicamente números, guiones, signos + y espacios.')
  .max(25, 'El teléfono no puede tener más de 25 dígitos'),
  removeProfileImage: z.boolean(),
  file: z.instanceof(File).optional(), // archivo opcional
});

export type ProfileData = z.infer<typeof profileSchema>;