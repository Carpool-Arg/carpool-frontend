'use client'
import {RegisterVehicleStep1Data, registerVehicleStep1Schema, RegisterVehicleStep2Data, registerVehicleStep2Schema, RegisterVehicleStep3Data, registerVehicleStep3Schema } from "@/schemas/auth/vehicleSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { VehicleTypeList } from "./type/VehicleTypeList"
import { registerVehicle, updateVehicle } from "@/services/vehicleService"
import { useRouter } from "next/navigation"
import { Alert } from "../ui/Alert"
import { vehicleFormData } from "@/types/forms"

export function VehicleForm({ initialData }: { initialData?: Vehicle }) {
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
    }
  })

  //Precargar datos si estamos en edición
  useEffect(() => {
    if (initialData) {
      console.log(initialData)
      step1Form.reset({
        vehicleTypeId: initialData.vehicleTypeId
      })
      step2Form.reset({
        domain: initialData.domain,
        brand: initialData.brand,
        model: initialData.model,
        year: initialData.year,
        color: initialData.color
      })
      step3Form.reset({
        availableSeats: initialData.availableSeats,
      })
    }

  }, [initialData])

  const handleNextFromStep1 = () => {
    setStep(2)
  }

  const handleNextFromStep2 = () => {
    setStep(3)
  }

  const handlePrev = () => {
    setStep(step - 1)
  }

  const handleSubmitFinal = async (data: RegisterVehicleStep3Data) => {
    setLoading(true)
    try {
      // Datos comunes
      const baseData: vehicleFormData = {
        ...step2Form.getValues(),
        ...data,
        vehicleType_Id: step1Form.getValues().vehicleTypeId, // Nota el guion bajo
      };

      let response;

      //Verificar si viene initialData, si es así significa que estamos editando
      if (initialData) {
        // Si es update, quitamos el domain
        const { domain, ...updateData } = baseData;

        response = await updateVehicle(initialData.id, updateData);
      } else {
        // Si es registro
        response = await registerVehicle(baseData);
      }

      if (!response.success) {
        setError(response.message || "Error al guardar el vehículo");
        return;
      }

      router.push("/vehicle");
    } catch (err) {
      setError("Error al guardar el vehículo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      
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
            {/* Marca y modelo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Marca"
                {...step2Form.register("brand")}
                disabled={!!initialData}
                error={step2Form.formState.errors.brand?.message}
              />
              <Input
                label="Modelo"
                {...step2Form.register("model")}
                error={step2Form.formState.errors.model?.message}
              />
            </div>

            {/* Patente y año */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Patente o dominio"
                {...step2Form.register("domain")}
                error={step2Form.formState.errors.domain?.message}
              />
              <Input
                label="Año"
                type="number"
                {...step2Form.register("year", { valueAsNumber: true })}
                error={step2Form.formState.errors.year?.message}
              />
            </div>

            {/* Color */}
            <Input
              label="Color"
              {...step2Form.register("color")}
              error={step2Form.formState.errors.color?.message}
            />

            {/* Botones */}
            <div className="flex gap-4 mt-4">
              <Button variant="outline" onClick={handlePrev} className="w-1/2">
                Volver
              </Button>
              <Button type="submit" variant="primary" className="w-1/2">
                Siguiente
              </Button>
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
            <div className="flex gap-4">
              <Button type="button" variant="outline" className="w-full" onClick={handlePrev}>Volver</Button>
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? (initialData ? 'Actualizando...' : 'Guardando...') : (initialData ? 'Actualizar' : 'Guardar')}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
