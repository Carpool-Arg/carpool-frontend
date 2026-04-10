import { z } from 'zod';

export const driverSchema = z.object({
  licenseClassId: z.number().min(1, "Selecciona una clase de licencia"),

  licenseExpirationDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'La fecha de vencimiento no es válida',
    })
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return inputDate >= today;
    }, {
      message: 'No puede ser una fecha pasada.',
    }),

  addressStreet: z.string().min(1).max(100),
  addressNumber: z.string().regex(/^\d+$/),

  cityId: z.number().min(1),


  frontImage: z
    .instanceof(File, { message: "La imagen frontal es obligatoria" }),

  backImage: z
    .instanceof(File, { message: "La imagen trasera es obligatoria" }),
});

export type DriverData = z.infer<typeof driverSchema>;