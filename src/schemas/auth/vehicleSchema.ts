// schemas/registerVehicleSchema.ts
import { z } from 'zod'

//Paso 1:
export const registerVehicleStep1Schema = z.object({
  vehicleTypeId: z.number().min(1, "Selecciona un tipo de vehículo"),
});

// Paso 2: Datos básicos del vehículo
export const registerVehicleStep2Schema = z.object({
  domain: z
    .string()
    .min(6, 'La patente debe tener entre 6 y 7 caracteres.')
    .max(7, 'La patente debe tener entre 6 y 7 caracteres.'),
      
  brand: z
    .string()
    .min(1, 'La marca del vehículo no puede estar en blanco.')
    .regex(/^[a-zA-Z0-9 ]+$/, 'La marca debe contener solo letras, números y espacios'),
  
  model: z
    .string()
    .min(1, 'El modelo del vehículo no puede estar en blanco.')
    .regex(/^[a-zA-Z0-9 ]+$/, 'El modelo debe contener solo letras, números y espacios'),
  
  year: z
    .number({
      required_error: 'El año del vehículo no puede estar en blanco.',
      invalid_type_error: 'El año debe ser un número válido'
    })
    .min(1900, 'El año debe ser posterior a 1900.')
    .max(new Date().getFullYear(), 'El año no puede estar en el futuro'),

  color: z
    .string()
    .min(1, 'El color del vehículo no puede estar en blanco.')
    .regex(/^[a-zA-Z ]+$/, 'El color debe contener solo letras y espacios')
})

// Paso 3: Datos de capacidad
export const registerVehicleStep3Schema = z.object({
  availableSeats: z
    .number({
      required_error: 'La cantidad de asientos disponibles no puede estar en blanco.',
      invalid_type_error: 'Debe ingresar un número válido.'
    })
    .min(1, 'La cantidad de asientos disponibles debe ser al menos 1.'),
})

// Esquema completo (por si quieres validar todo en un solo paso)
export const completeRegisterVehicleSchema = registerVehicleStep1Schema
  .merge (registerVehicleStep2Schema)
  .merge(registerVehicleStep3Schema)

// Tipos TypeScript generados
export type RegisterVehicleStep1Data = z.infer<typeof registerVehicleStep1Schema>;
export type RegisterVehicleStep2Data = z.infer<typeof registerVehicleStep2Schema>
export type RegisterVehicleStep3Data = z.infer<typeof registerVehicleStep3Schema>
export type CompleteRegisterVehicleData = z.infer<typeof completeRegisterVehicleSchema>
