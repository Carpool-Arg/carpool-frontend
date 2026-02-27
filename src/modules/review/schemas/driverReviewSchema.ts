import { z } from "zod";

export const driverReviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Seleccioná una calificación")
    .max(5),
  comment: z
    .string()
    .max(250, "Máximo 250 caracteres"),
});

export type DriverReviewForm = z.infer<typeof driverReviewSchema>;
