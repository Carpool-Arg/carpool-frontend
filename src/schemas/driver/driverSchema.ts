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
    }),

  birthDate: z
    .string()
    .refine((date) => {
      const parsed = Date.parse(date);
      if (isNaN(parsed)) return false;
      const birth = new Date(parsed);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();
      return age > 18 || (age === 18 && (monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0)));
    }, {
      message: 'Debes ser mayor de 18 años',
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
