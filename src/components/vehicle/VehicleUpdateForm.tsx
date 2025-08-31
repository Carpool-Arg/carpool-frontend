

'use client'
import {CompleteRegisterVehicleData, completeRegisterVehicleSchema } from "@/schemas/vehicle/vehicleSchema"
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
import { completeRegisterSchema } from "@/schemas/auth/registerSchema"

export function VehicleUpdateForm({ initialData }: { initialData?: Vehicle }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Paso 1: Selección de tipo de vehículo
  const vehicleForm = useForm<CompleteRegisterVehicleData>({
    resolver: zodResolver(completeRegisterVehicleSchema),
    mode: 'onChange',
    defaultValues: { vehicleTypeId: 0 }
  })
  console.log('initialData',initialData)

  //Precargar datos si estamos en edición
  useEffect(() => {
    if (initialData) {
      vehicleForm.reset({
        vehicleTypeId: initialData.vehicleTypeId,
        domain: initialData.domain,
        brand: initialData.brand,
        model: initialData.model,
        year: initialData.year,
        color: initialData.color,
        availableSeats: initialData.availableSeats
      })
    }

  }, [initialData])


  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Tomamos todos los valores del form y armamos el objeto que el backend espera
      const values = vehicleForm.getValues();
      const updateData: vehicleFormData = {
        brand: values.brand,
        model: values.model,
        year: values.year,
        color: values.color,
        availableSeats: values.availableSeats,
        domain: values.domain,           // ahora siempre lo incluimos
        vehicleTypeId: values.vehicleTypeId, // importante que coincida con lo que espera el backend
      };

      console.log('updateData',updateData)

      const response = await updateVehicle(initialData!.id, updateData);

      if (!response.success) {
        setError(response.message || "Error al actualizar el vehículo");
        return;
      }

      router.push("/vehicle");
    } catch (err) {
      setError("Error al actualizar el vehículo");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-xl font-semibold">Selecciona el tipo de vehículo</h1>
      <form onSubmit={vehicleForm.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        {/* Lista de tipos de vehículos */}
        <VehicleTypeList 
          selectedId={vehicleForm.watch("vehicleTypeId")} 
          onSelect={(id) => vehicleForm.setValue("vehicleTypeId", id, { shouldValidate: true })} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Marca"
            {...vehicleForm.register("brand")}
            error={vehicleForm.formState.errors.brand?.message}
          />
          <Input
            label="Modelo"
            {...vehicleForm.register("model")}
            error={vehicleForm.formState.errors.model?.message}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
                <Input
                    label="Patente o dominio"
                    {...vehicleForm.register("domain")}
                    error={vehicleForm.formState.errors.domain?.message}
                    disabled={!!initialData}
                />
            </div>
            
            <Input
                label="Año"
                type="number"
                {...vehicleForm.register("year", { valueAsNumber: true })}
                error={vehicleForm.formState.errors.year?.message}
            />
            <Input 
                label="Asientos" 
                type="number" {...vehicleForm.register('availableSeats', { valueAsNumber: true })} 
                error={vehicleForm.formState.errors.availableSeats?.message} 
            />
        </div>

        

        <Button type="submit" variant="primary" className="w-full">
          Siguiente
        </Button>
      </form>

    </div>
  )
}

