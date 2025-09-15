import { z } from 'zod';

export const driverSchema = z.object({
  licenseClass: z
    .string()
    .min(1, 'La clase de licencia es obligatoria')
    .max(5, 'La clase de licencia no puede tener más de 5 caracteres'),

  licenseExpirationDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'La fecha de vencimiento no es válida',
    })
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalizar horas para comparar solo la fecha
      return inputDate >= today;
    }, {
      message: 'No puede ser una fecha pasada.',
    }),
    
  addressStreet: z
    .string()
    .min(1, 'La calle es obligatoria')
    .max(100, 'La calle no puede tener más de 100 caracteres'),

  addressNumber: z
    .string()
    .regex(/^\d+$/, 'El número de calle debe contener solo dígitos'),

  locality: z
    .string()
    .min(1, 'La localidad es obligatoria')
    .max(100, 'La localidad no puede tener más de 100 caracteres'),
});

export type DriverData = z.infer<typeof driverSchema>;