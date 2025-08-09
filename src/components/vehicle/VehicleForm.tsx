'use client'
import {RegisterVehicleStep1Data, registerVehicleStep1Schema, RegisterVehicleStep2Data, registerVehicleStep2Schema, RegisterVehicleStep3Data, registerVehicleStep3Schema } from "@/schemas/auth/vehicleSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { VehicleTypeList } from "./type/VehicleTypeList"
import { registerVehicle } from "@/services/vehicleService"
import { useRouter } from "next/navigation"
import { Alert } from "../ui/Alert"

export function VehicleForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Paso 1: Selección de tipo de vehículo
  const step1Form = useForm<RegisterVehicleStep1Data>({
    resolver: zodResolver(registerVehicleStep1Schema),
    mode: 'onChange',
    defaultValues: { vehicleTypeId: 0 }
  })

  // Paso 2: Datos básicos del vehículo
  const step2Form = useForm<RegisterVehicleStep2Data>({
    resolver: zodResolver(registerVehicleStep2Schema),
    mode: 'onChange',
    defaultValues: {
      domain: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: ''
    }
  })

  // Paso 3: Datos de capacidad
  const step3Form = useForm<RegisterVehicleStep3Data>({
    resolver: zodResolver(registerVehicleStep3Schema),
    mode: 'onChange',
    defaultValues: {
      availableSeats: 1,
      luggageCapacity: 0
    }
  })

  const handleNextFromStep1 = (data: RegisterVehicleStep1Data) => {
    setStep(2)
  }

  const handleNextFromStep2 = (data: RegisterVehicleStep2Data) => {
    setStep(3)
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  const handleSubmitFinal = async (data: RegisterVehicleStep3Data) => {
    setLoading(true)
    try {
      const vehicleData = { 
        ...step2Form.getValues(),        // datos básicos
        ...data,                        // capacidad
        vehicleType_Id: step1Form.getValues().vehicleTypeId  // renombrar aquí
      }
      console.log(vehicleData)
      const response = await registerVehicle(vehicleData)
      if (!response.success) {
        setError(response.message || "Error al registrar el vehículo")
        return
      }
      router.push('/vehicle')
    } catch (err) {
      setError('Error al registrar el vehículo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h1 className="text-xl font-semibold">Selecciona el tipo de vehículo</h1>
          <form onSubmit={step1Form.handleSubmit(handleNextFromStep1)} className="flex flex-col gap-4">
            {/* Lista de tipos de vehículos */}
            <VehicleTypeList 
              selectedId={step1Form.watch("vehicleTypeId")} 
              onSelect={(id) => step1Form.setValue("vehicleTypeId", id, { shouldValidate: true })} 
            />

            {step1Form.formState.errors.vehicleTypeId && (
              <p className="text-red-500 text-sm">{step1Form.formState.errors.vehicleTypeId.message}</p>
            )}

            <Button type="submit" variant="primary" className="w-full">
              Siguiente
            </Button>
          </form>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h1 className="text-xl font-semibold mb-4">Registrar vehículo</h1>
          <form onSubmit={step2Form.handleSubmit(handleNextFromStep2)} className="flex flex-col gap-4">
            <Input label="Patente o dominio" {...step2Form.register('domain')} error={step2Form.formState.errors.domain?.message} />
            <Input label="Marca" {...step2Form.register('brand')} error={step2Form.formState.errors.brand?.message} />
            <Input label="Modelo" {...step2Form.register('model')} error={step2Form.formState.errors.model?.message} />
            <Input label="Año" type="number" {...step2Form.register('year', { valueAsNumber: true })} error={step2Form.formState.errors.year?.message} />
            <Input label="Color" {...step2Form.register('color')} error={step2Form.formState.errors.color?.message} />

            {/* Contenedor de botones en línea */}
            <div className="flex gap-4 mt-4">
              <Button variant="outline" onClick={handlePrev} className="w-1/2">Volver</Button>
              <Button type="submit" variant="primary" className="w-1/2">Siguiente</Button>
            </div>
          </form>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          {error && <Alert message={error} />}
          <h1 className="text-xl font-semibold">Espacio</h1>
          <form onSubmit={step3Form.handleSubmit(handleSubmitFinal)} className="flex flex-col gap-4">
            <Input label="Asientos disponibles" type="number" {...step3Form.register('availableSeats', { valueAsNumber: true })} error={step3Form.formState.errors.availableSeats?.message} />
            <Input label="Equipaje" type="number" {...step3Form.register('luggageCapacity', { valueAsNumber: true })} error={step3Form.formState.errors.luggageCapacity?.message} />
            <p className="text-xs text-gray-500">Cantidad aproximada de mochilas, bolsos y/o valijas que entran</p>

            <div className="flex gap-4">
              <Button type="button" variant="outline" className="w-full" onClick={handlePrev}>Volver</Button>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
