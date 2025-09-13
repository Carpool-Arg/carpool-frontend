import { z } from "zod";

export const tripStopSchema = z
  .object({
    cityId: z
      .number({ invalid_type_error: "La ciudad de origen es obligatoria" })
      .int("La ciudad de origen debe ser un número entero")
      .min(1, "La ciudad de origen es obligatoria"),

    // order: z
    //   .number({ invalid_type_error: "El orden es obligatorio" })
    //   .int("El orden no puede ser un ")
    //   .min(1, "La ciudad de destino es obligatoria"),

    intermediateCity: z.string().optional(), // opcional

    observation: z
        .string()
        .min(1, 'La marca del vehículo no puede estar en blanco.')
})

export type TripStopFormData = z.infer<typeof tripStopSchema>;