import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().optional(),
  lastname: z.string().optional(),
  dni: z.string().optional(),
  email: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'UNSPECIFIED']).optional(),
  phone: z.string().min(8, 'Número demasiado corto').max(15, 'Número demasiado largo'),
  removeProfileImage: z.boolean(),
  file: z.instanceof(File).optional(), // archivo opcional
});

export type ProfileData = z.infer<typeof profileSchema>;