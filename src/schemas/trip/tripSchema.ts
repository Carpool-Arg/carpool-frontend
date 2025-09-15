import { z } from "zod";

export const tripStopSchema = z.object({
  cityId: z
    .number({ invalid_type_error: "La ciudad es obligatoria" })
    .int()
    .min(1, "La ciudad es obligatoria"),
  start: z.boolean(),
  destination: z.boolean(),
  order: z.number().int().min(1),
  observation: z.string().optional(),
});

export const tripSchema = z
  .object({
    startDateTime: z.string().nonempty("La fecha es obligatoria"),

    originCityId: z
      .number({ invalid_type_error: "La ciudad de origen es obligatoria" })
      .int()
      .min(1, "La ciudad de origen es obligatoria"),

    destinationCityId: z
      .number({ invalid_type_error: "La ciudad de destino es obligatoria" })
      .int()
      .min(1, "La ciudad de destino es obligatoria"),

    availableSeat: z
      .number({ invalid_type_error: "Los asientos deben ser un número" })
      .int()
      .min(1, "Debe haber al menos 1 asiento"),

    availableBaggage: z.string().optional(),

    seatPrice: z
      .number({ invalid_type_error: "El precio debe ser un número" })
      .min(0, "El precio no puede ser negativo"),

    idVehicle: z
      .number({ invalid_type_error: "El ID del vehículo debe ser un número" })
      .int()
      .min(0, "El ID del vehículo no puede ser negativo"),

    tripStops: z.array(tripStopSchema).optional(), // paradas intermedias opcionales
  })
  .refine((data) => data.originCityId !== data.destinationCityId, {
    message: "La ciudad de origen y destino no pueden ser iguales",
    path: ["destinationCityId"],
  });

export type TripFormData = z.infer<typeof tripSchema>;
