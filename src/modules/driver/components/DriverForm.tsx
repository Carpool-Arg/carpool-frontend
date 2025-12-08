'use client'

import { useEffect, useState } from "react"
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
import { fetchLicenseClasses } from "@/services/licenseClass/licenseClassService"
import { LicenseClassResponseDTO } from "../types/dto/licenseClassResponseDTO"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function DriverForm() {
  const [error, setError] = useState<string | null>(null);
  const [licenseClasses, setLicenseClasses] = useState<LicenseClassResponseDTO>();
  const router = useRouter();
  const {fetchUser} = useAuth();

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await fetchLicenseClasses();
        if (res.state==="ERROR") {
          setError(res.messages?.[0] || "No se pudieron cargar las clases de licencia");
          return;
        }

        setLicenseClasses(res);
      } catch {
        setError("No se pudieron cargar las clases de licencia");
      }
    };

    loadClasses();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DriverData>({
    resolver: zodResolver(driverSchema),
    mode: 'onChange',
    defaultValues: {
      licenseClassId: undefined,
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

        {/* Clase de licencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <Controller
              name="licenseClassId"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Clase de licencia</label>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar clase..." />
                    </SelectTrigger>

                    <SelectContent>
                      {licenseClasses?.data!.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {errors.licenseClassId && (
                    <p className="text-red-500 text-xs">{errors.licenseClassId.message}</p>
                  )}
                </div>
              )}
            />

          </div>

          {/* Vencimiento */}
          <div className="md:col-span-1">

            <Input
              label="Vencimiento"
              type="date"
              autoComplete="licenseExpirationDate"
              {...register('licenseExpirationDate')}
              error={errors.licenseExpirationDate?.message}
              />
          </div>

          
          {/* Localidad */}
          <div className="md:col-span-2">
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

          <div className="md:col-span-1">

            <Input
              label="Dirección"
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