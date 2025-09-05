import { z } from "zod";

export const tripSchema = z.object({
  date: z.string().nonempty("La fecha es obligatoria"),
  time: z.string().nonempty("La hora es obligatoria"),

  originTown: z.string().nonempty("La ciudad de origen es obligatoria"),
  destinationTown: z.string().nonempty("La ciudad de destino es obligatoria"),
  intermediateTown: z.string().optional(), // opcional

  availableSeat: z
    .number({ invalid_type_error: "Los asientos deben ser un número" })
    .int("Los asientos deben ser un número entero")
    .min(1, "Debe haber al menos 1 asiento"),

  availableBaggage: z.string().optional(),

  seatPrice: z
    .number({ invalid_type_error: "El precio debe ser un número" })
    .min(0, "El precio no puede ser negativo"),

  idVehicle: z
    .number({ invalid_type_error: "El ID del vehículo debe ser un número" })
    .int("El ID del vehículo debe ser un entero")
    .min(0, "El ID del vehículo no puede ser negativo"),
});


export type TripFormData = z.infer<typeof tripSchema>;
