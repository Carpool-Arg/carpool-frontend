import { z } from "zod";

export const driverReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Seleccioná una calificación")
    .max(5),
  comment: z
    .string()
    .max(255, "Máximo 255 caracteres"),
});

export type DriverReviewForm = z.infer<typeof driverReviewSchema>;
