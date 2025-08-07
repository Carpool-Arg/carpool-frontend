// schemas/registerSchema.ts
import { z } from 'zod'

// Esquema para completar el registro
export const completeRegistrationSchema = z
  .object({
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede tener más de 100 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
    username: z
      .string()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(25, 'El nombre de usuario no puede tener más de 25 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'El nombre de usuario solo puede contener letras, números y guiones bajos'),

    lastname: z
      .string()
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(100, 'El apellido no puede tener más de 100 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras y espacios'),

    dni: z
      .string()
      .min(7, 'El DNI debe tener al menos 7 dígitos')
      .max(50, 'El DNI no puede tener más de 50 dígitos')
      .regex(/^\d+$/, 'El DNI solo puede contener números'),

    phone: z
      .string()
      .min(7, 'El teléfono debe tener al menos 7 dígitos')
      .max(25, 'El teléfono no puede tener más de 25 dígitos')
      .regex(/^[0-9+\-\s()]+$/, 'El número de teléfono debe contener únicamente números, guiones, signos + y espacios.'),

    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(255, 'La contraseña no puede tener más de 255 caracteres')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })



// Tipos TypeScript generados a partir de los esquemas
export type CompleteRegistrationData = z.infer<typeof completeRegistrationSchema>