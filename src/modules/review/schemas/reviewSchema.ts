import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Seleccioná una calificación")
    .max(5),
  comment: z
    .string()
    .max(250, "Máximo 250 caracteres"),
});

export type ReviewForm = z.infer<typeof reviewSchema>;
