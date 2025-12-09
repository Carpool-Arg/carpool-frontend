'use client'

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/authContext" 
import { useRouter } from "next/navigation"

import { registerDriver } from "@/services/driver/driverService"
import { Alert } from "@/components/ux/Alert"
import { Input } from "@/components/ux/Input"

import { Button } from "@/components/ux/Button"
import { DriverData, driverSchema } from "../schema/driverSchema"
import { CityAutocomplete } from "@/modules/city/components/CityAutocomplete"
import Separator from "@/components/ux/Separator"


export function DriverForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {fetchUser} = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DriverData>({
    resolver: zodResolver(driverSchema),
    mode: 'onChange',
    defaultValues: {
      licenseClass: '',
      licenseExpirationDate: '',// formato ISO (YYYY-MM-DD)       
      addressStreet: '',
      addressNumber: '',
      cityId: 0,
    }
  })

  const formatDate = (date: string) => {
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  };

  const onSubmit = async (data: DriverData) => {
    setError(null);
    try {
       const payload = {
        ...data,
        licenseExpirationDate: formatDate(data.licenseExpirationDate),
      };
      
      const response = await registerDriver(payload)
      if (response.state === "ERROR") {
        setError(response.messages?.[0] || "Error al registrar usuario");
        return
      }
      await fetchUser();
      router.push('/profile');
    } catch (error: unknown) {
      let message = "Error desconocido";

      if (error instanceof Error) {
        message = error.message;
      }
      setError(message || 'Error al crear el perfil de conductor');
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        

        {error && <Alert message={error} />}
        <div>
          <h1 className="font-semibold">Datos de la licencia</h1>
          <Separator marginY="my-1" color="bg-gray-2"/>

        </div>
        {/* Clase de licencia */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">

            <Input
              label="Clase de Licencia"
              type="text"
              autoComplete="licenseClass"
              className="md:col-span-1 w-1/2"
              {...register('licenseClass')}
              error={errors.licenseClass?.message}
              />
          </div>

          {/* Vencimiento */}
          <div className="md:col-span-2">

            <Input
              label="Vencimiento"
              type="date"
              autoComplete="licenseExpirationDate"
              {...register('licenseExpirationDate')}
              error={errors.licenseExpirationDate?.message}
              />
          </div>


          <div className="md:col-span-4">
            <h1 className="font-semibold">Domicilio</h1>
            <Separator marginY="my-1" color="bg-gray-2"/>
          </div>
          {/* Localidad */}
          <div className="md:col-span-4">
            <Controller
              name="cityId"
              control={control}
              render={({ field }) => (
                <CityAutocomplete
                  label="Localidad"
                  placeholder="Selecciona tu localidad"
                  value={field.value}
                  onChange={(city) => field.onChange(city?.id ?? null)}
                  error={errors.cityId?.message}
                  outline={true}
                />
              )}
            />
          </div>

          <div className="md:col-span-3">

            <Input
              label="Calle"
              type="text"
              autoComplete="addressStreet"
              {...register('addressStreet')}
              error={errors.addressStreet?.message}
              />
          </div>
          
          <div className="md:col-span-1">
            <Input
              label="Número"
              type="text"
              autoComplete="addressNumber"
              {...register('addressNumber')}
              error={errors.addressNumber?.message}
              />
          </div>
          

        </div>


        <Button
          variant="primary"
          type="submit"
          className="w-full"
        >
          Completar
        </Button>
      </form>
    </div>
  )
}