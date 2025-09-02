'use client'

import {CompleteRegisterVehicleData, completeRegisterVehicleSchema } from "@/schemas/vehicle/vehicleSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { VehicleTypeList } from "./type/VehicleTypeList"
import { updateVehicle } from "@/services/vehicleService"
import { useRouter } from "next/navigation"

import { vehicleFormData } from "@/types/forms"

export function VehicleUpdateForm({ initialData }: { initialData?: Vehicle }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editableVehicle, setEditableVehicle] = useState<Vehicle>({
      id: 0,
      brand: '',
      model: '',
      domain: '',
      year: 0,
      vehicleTypeId: 0,
      vehicleTypeName: '',
      availableSeats: 1,
      color: '',
      driverId:0,
      createdAt: ''
      });
  const [isChanged, setIsChanged] = useState(false);
  const router = useRouter()

  // Paso 1: Selección de tipo de vehículo
  const vehicleForm = useForm<CompleteRegisterVehicleData>({
    resolver: zodResolver(completeRegisterVehicleSchema),
    mode: 'onChange',
    defaultValues: { vehicleTypeId: 0 }
  })

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
      setEditableVehicle(initialData)
    }

  }, [initialData])

  useEffect(() => {
    if (!initialData) {
      setIsChanged(false);
      return;
    }

    const changed =
      editableVehicle.color !== (initialData.color ?? '') ||
      editableVehicle.model !== (initialData.model ?? '') ||
      editableVehicle.availableSeats !== (initialData.availableSeats ?? 1) ||
      editableVehicle.year !== (initialData.year ?? '') ||
      editableVehicle.vehicleTypeId !== (initialData.vehicleTypeId ?? '') ||
      editableVehicle.brand !== (initialData.brand ?? '');

    setIsChanged(changed);
  }, [editableVehicle, initialData]);


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

  const handleChange = (field: keyof typeof editableVehicle, value: string) => {
    setEditableVehicle((prev) => ({
    ...prev,
    [field]:
      field === "year" || field === "availableSeats"
        ? Number(value) 
        : value,
  }));
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
            onChange={(e) => handleChange('brand', e.target.value)}
            error={vehicleForm.formState.errors.brand?.message}
          />
          <Input
            label="Modelo"
            {...vehicleForm.register("model")}
            onChange={(e) => handleChange('model', e.target.value)}
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
            
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <Input
                label="Año"
                type="number" {...vehicleForm.register("year", { valueAsNumber: true })}
                onChange={(e) => handleChange('year', e.target.value)}
                error={vehicleForm.formState.errors.year?.message}
            />
            <Input 
                label="Asientos" 
                type="number" {...vehicleForm.register('availableSeats', { valueAsNumber: true })} 
                onChange={(e) => handleChange('availableSeats', e.target.value)}
                error={vehicleForm.formState.errors.availableSeats?.message} 
            />
            </div>
            
        </div>

        <button
          type="submit"
          disabled={!isChanged}
          className={`w-full px-4 py-2 rounded-lg , ${
            isChanged ? 
                'bg-transparent border border-gray-400 text-gray-700 dark:border-gray-5 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-2 focus:ring-gray-400 cursor-pointer' 
            : 
                ' cursor-not-allowed text-gray-700 dark:text-gray-3 dark:bg-gray-2 focus:ring-gray-400'
          }`}
        >
          Guardar cambios
        </button>
      </form>

    </div>
  )
}

