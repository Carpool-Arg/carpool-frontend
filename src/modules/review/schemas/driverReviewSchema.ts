import { z } from "zod";

export const driverReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Seleccioná una calificación")
    .max(5),
  comment: z
    .string()
    .min(10, "La reseña debe tener al menos 10 caracteres")
    .max(300, "Máximo 300 caracteres"),
});

export type DriverReviewForm = z.infer<typeof driverReviewSchema>;
