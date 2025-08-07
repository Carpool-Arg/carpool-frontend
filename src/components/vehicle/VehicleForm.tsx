'use client'
import { RegisterVehicleStep1Data, registerVehicleStep1Schema, RegisterVehicleStep2Data, registerVehicleStep2Schema } from "@/schemas/auth/vehicleSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export function VehicleForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Paso 1: Datos básicos del vehículo
  const step1Form = useForm<RegisterVehicleStep1Data>({
    resolver: zodResolver(registerVehicleStep1Schema),
    mode: 'onChange',
    defaultValues: {
      domain: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      color: ''
    }
  })

  // Paso 2: Datos de capacidad
  const step2Form = useForm<RegisterVehicleStep2Data>({
    resolver: zodResolver(registerVehicleStep2Schema),
    mode: 'onChange',
    defaultValues: {
      availableSeats: 1,
      luggageCapacity: 0
    }
  })

  const handleNext = (data: RegisterVehicleStep1Data) => {
    setStep(2)
  }

  const handlePrev = () => {
    setStep(1)
  }

  const handleSubmitFinal = async (data: RegisterVehicleStep2Data) => {
    setLoading(true)
    try {
      const vehicleData = { ...step1Form.getValues(), ...data }
      console.log(vehicleData)
      // enviar vehicleData al backend
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6 w-full">
        {step === 1 && (
        <>
            {/* Botón volver al inicio solo en step 1 */}
            <div className="mb-2">
                <Link href="/vehicle" className="text-blue-600 hover:text-blue-800 font-medium">
                &lt; inicio
                </Link>
            </div>

            <h1 className="text-xl font-semibold">Registrar vehículo</h1>
            <form onSubmit={step1Form.handleSubmit(handleNext)} className="flex flex-col gap-4">
            <Input
                label="Patente o dominio"
                placeholder="Letras y/o números"
                {...step1Form.register('domain')}
                error={step1Form.formState.errors.domain?.message}
            />

            <Input
                label="Marca"
                placeholder="Buscá"
                {...step1Form.register('brand')}
                error={step1Form.formState.errors.brand?.message}
            />

            <Input
                label="Modelo"
                placeholder="Buscá"
                {...step1Form.register('model')}
                error={step1Form.formState.errors.model?.message}
            />

            <Input
                label="Año"
                type="number"
                placeholder="0000"
                {...step1Form.register('year', { valueAsNumber: true })}
                error={step1Form.formState.errors.year?.message}
            />

            <Input
                label="Color"
                placeholder="Buscá"
                {...step1Form.register('color')}
                error={step1Form.formState.errors.color?.message}
            />

            <Button type="submit" variant="primary" className="w-full">
                Siguiente
            </Button>
            </form>
        </>
        )}

        {step === 2 && (
        <>
            <h1 className="text-xl font-semibold">Espacio</h1>
            <form onSubmit={step2Form.handleSubmit(handleSubmitFinal)} className="flex flex-col gap-4">
            <Input
                label="Asientos disponibles"
                type="number"
                placeholder="Número"
                {...step2Form.register('availableSeats', { valueAsNumber: true })}
                error={step2Form.formState.errors.availableSeats?.message}
            />

            <Input
                label="Equipaje"
                type="number"
                placeholder="Número"
                {...step2Form.register('luggageCapacity', { valueAsNumber: true })}
                error={step2Form.formState.errors.luggageCapacity?.message}
            />
            <p className="text-xs text-gray-500">
                Cantidad aproximada de mochilas, bolsos y/o valijas que entran en el lugar disponible
            </p>

            <div className="flex gap-4">
                <Button type="button" variant="outline" className="w-full" onClick={handlePrev}>
                Volver
                </Button>
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Guardando...' : 'Siguiente'}
                </Button>
            </div>
            </form>
        </>
        )}
    </div>
    )
}
