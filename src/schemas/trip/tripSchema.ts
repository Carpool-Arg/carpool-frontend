import { z } from "zod";

export const tripStopSchema = z.object({
  cityId: z
    .number({ invalid_type_error: "La ciudad es obligatoria" })
    .int()
    .min(0, "La ciudad es obligatoria"), 
  start: z.boolean(),
  destination: z.boolean(),
  order: z.number().int().min(1),
  observation: z
    .string()
    .nonempty("El punto de encuentro/destino es obligatorio")
    .max(100, "La observación no puede tener más de 100 caracteres"),
});

export const tripSchema = z.object({
  startDateTime: z
    .string()
    .nonempty("La fecha es obligatoria")
    .refine((value) => {
      const now = new Date();
      const date = new Date(value);
      const minDate = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutos después
      return date >= minDate;
    }, "La fecha debe ser al menos 30 minutos después de la hora actual"),


  availableSeat: z
    .number({ invalid_type_error: "Los asientos deben ser un número" })
    .int()
    .min(1, "Debe haber al menos 1 asiento"),

  availableBaggage: z.string().optional(),

  seatPrice: z
    .number({ invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo")
    .max(99999999, " El precio no puede ser mayor a $99999"),

  idVehicle: z
    .number({ invalid_type_error: "El ID del vehículo debe ser un número" })
    .int()
    .min(0, "El ID del vehículo no puede ser negativo"),

  tripStops: z.array(tripStopSchema).optional(),
});

export type TripFormData = z.infer<typeof tripSchema>;
