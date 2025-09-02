'use client'

import {CompleteRegisterVehicleData, completeRegisterVehicleSchema } from "@/schemas/vehicle/vehicleSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { VehicleTypeList } from "./type/VehicleTypeList"
import { deleteVehicle, updateVehicle } from "@/services/vehicleService"
import { useRouter } from "next/navigation"

import { vehicleFormData } from "@/types/forms"
import { Button } from "../ui/Button"
import { CircleX, X } from "lucide-react"
import { AlertDialog } from "../ui/AlertDialog"

export function VehicleUpdateForm({ vehicle }: { vehicle?: Vehicle }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    if (vehicle) {
      vehicleForm.reset({
        vehicleTypeId: vehicle.vehicleTypeId,
        domain: vehicle.domain,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        availableSeats: vehicle.availableSeats
      })
      setEditableVehicle(vehicle)
    }

  }, [vehicle])

  useEffect(() => {
    const subscription = vehicleForm.watch((value) => {
      setEditableVehicle((prev) => ({
        ...prev,
        vehicleTypeId: value.vehicleTypeId ?? 0
      }));
    });
    return () => subscription.unsubscribe();
  }, [vehicleForm]);

  useEffect(() => {
    if (!vehicle) {
      setIsChanged(false);
      return;
    }

    const changed =
      editableVehicle.color !== (vehicle.color ?? '') ||
      editableVehicle.model !== (vehicle.model ?? '') ||
      editableVehicle.availableSeats !== (vehicle.availableSeats ?? 1) ||
      editableVehicle.year !== (vehicle.year ?? '') ||
      editableVehicle.vehicleTypeId !== (vehicle.vehicleTypeId ?? '') ||
      editableVehicle.brand !== (vehicle.brand ?? '');

    setIsChanged(changed);
  }, [editableVehicle, vehicle]);


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

      const response = await updateVehicle(vehicle!.id, updateData);

      if (response.state === "ERROR") {
        setError(response.messages?.[0] || "Error al actualizar el vehículo");
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

  const handleDelete = async () => {
    if (!vehicle) return;
    setLoading(true);
    try {
      const response = await deleteVehicle(vehicle.id);
      if (response.state === "OK") {
        router.push("/vehicle"); // redirige después de eliminar
      } else {
        setError(response.messages?.[0] || "Error al eliminar el vehículo");
      }
    } catch (err) {
      setError("Error al eliminar el vehículo");
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
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
                    disabled={!!vehicle}
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

        
      </form>

      <div className="grid grid-cols-3 gap-4">
        <Button variant="danger" className="flex items-center gap-1" onClick={() => setIsDialogOpen(true)}>
          <CircleX size={14}/>
          Dar de baja
        </Button>
        <button
          type="submit"
          disabled={!isChanged}
          className={`w-full col-span-2 px-4 py-2 rounded-lg , ${
            isChanged ? 
                'bg-transparent border border-gray-400 text-gray-700 dark:border-gray-5 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-2 focus:ring-gray-400 cursor-pointer' 
            : 
                ' cursor-not-allowed text-gray-700 dark:text-gray-3 dark:bg-gray-2 focus:ring-gray-400'
          }`}
        >
          Guardar cambios
        </button>

      </div>

      <AlertDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDelete}
        type="error"
        title="Confirmar eliminación"
        description="¿Estás seguro de que querés eliminar este vehículo? Esta acción no se puede deshacer."
        confirmText="Aceptar"
        cancelText="Cancelar"
      />

    </div>
  )
}

