'use client'

import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/authContext" 
import { Alert } from "../ui/Alert"
import { useRouter } from "next/navigation"
import { DriverData, driverSchema } from "@/schemas/auth/driverSchema"
import { registerDriver } from "@/services/driverService"

export function DriverForm() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {fetchUser} = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverData>({
    resolver: zodResolver(driverSchema),
    mode: 'onChange',
    defaultValues: {
      licenseClass: '',
      licenseExpirationDate: '',// formato ISO (YYYY-MM-DD)
      birthDate: '',          
      addressStreet: '',
      addressNumber: '',
      locality: '',
    }
  })

  const onSubmit = async (data: DriverData) => {
    setError(null);
    try {
      console.log('data enviada',data)
      const response = await registerDriver(data)
      if (!response.success) {
        setError(response.message || "Error al registrar usuario");
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Licencia de conducir"
            type="text"
            autoComplete="licenseClass"
            {...register('licenseClass')}
            error={errors.licenseClass?.message}
          />

          <Input
            label="Vencimiento"
            type="text"
            autoComplete="licenseExpirationDate"
            {...register('licenseExpirationDate')}
            error={errors.licenseExpirationDate?.message}
          />

          <Input
            label="Fecha de Nacimiento"
            type="text"
            autoComplete="birthDate"
            {...register('birthDate')}
            error={errors.birthDate?.message}
          />

          <Input
            label="Dirección"
            type="text"
            autoComplete="addressStreet"
            {...register('addressStreet')}
            error={errors.addressStreet?.message}
          />

          <Input
            label="Número"
            type="text"
            autoComplete="addressNumber"
            {...register('addressNumber')}
            error={errors.addressNumber?.message}
          />

          <Input
            label="Localidad"
            type="text"
            autoComplete="locality"
            {...register('locality')}
            error={errors.locality?.message}
          />
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