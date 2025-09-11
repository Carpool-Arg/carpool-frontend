import { z } from "zod";

export const tripSchema = z
  .object({
    startDateTime: z.string().nonempty("La fecha es obligatoria"),

    originCityId: z
      .number({ invalid_type_error: "La ciudad de origen es obligatoria" })
      .int("La ciudad de origen debe ser un número entero")
      .min(1, "La ciudad de origen es obligatoria"),

    destinationCityId: z
      .number({ invalid_type_error: "La ciudad de destino es obligatoria" })
      .int("La ciudad de destino debe ser un número entero")
      .min(1, "La ciudad de destino es obligatoria"),

    intermediateCity: z.string().optional(), // opcional

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
  })
  .refine(
    (data) => data.originCityId !== data.destinationCityId,
    {
      message: "La ciudad de origen y destino no pueden ser iguales",
      path: ["destinationCityId"], // asigna el error al campo de destino
    }
  );

export type TripFormData = z.infer<typeof tripSchema>;

export type TripRequest = Omit<TripFormData, "date" | "time"> & {
  startDateTime: string;
};
