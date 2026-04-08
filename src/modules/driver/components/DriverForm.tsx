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
import { DriverFormSkeleton } from "./DriverSkeleton"
import Separator from "@/components/ux/Separator"
import { Image } from "lucide-react"


export function DriverForm() {
  const router = useRouter();
  const {fetchUser} = useAuth();

  const [error, setError] = useState<string | null>(null);

  const [licenseClasses, setLicenseClasses] = useState<LicenseClassResponseDTO>();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  

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

    if (!frontImage || !backImage) {
      setError("Debes subir ambas imágenes de la licencia");
      return;
    }

    try {
      const payload = {
        ...data,
        licenseExpirationDate: formatDate(data.licenseExpirationDate),
      };

      const response = await registerDriver(
        payload,
        frontImage,
        backImage
      );

      if (response.state === "ERROR") {
        setError(response.messages?.[0] || "Error al registrar usuario");
        return;
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
  };

  if (!licenseClasses && !error) {
    return <DriverFormSkeleton/>;
  }

  if (error && (!licenseClasses?.data || licenseClasses.data.length === 0)) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <Alert message={error} />
      </div>
    );
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
                    <SelectTrigger className="h-10.5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* FRONT */}
          <div
            className="relative border-2 border-dashed border-white/12 rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/25 hover:bg-white/2 transition-colors group"
            onClick={() => document.getElementById('frontInput')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) setFrontImage(file);
            }}
          >
            <input
              id="frontInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFrontImage(e.target.files?.[0] || null)}
            />

            {frontImage ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-md bg-white/6 border border-white/8 flex items-center justify-center">
                  <Image size={14} className="text-white/50" />
                </div>
                <p className="text-[12px] text-white/60 text-center max-w-35 truncate">{frontImage.name}</p>
                <p className="text-[10px] text-white/25">click para cambiar</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-white/4 border border-white/8 flex items-center justify-center group-hover:bg-white/6 transition-colors">
                  <Image size={14} className="text-white/30 group-hover:text-white/50 transition-colors" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <p className="text-[12px] text-white/40">Frente de la licencia</p>
                  <p className="text-[10px] text-white/20">Arrastrá o hacé click</p>
                </div>
              </div>
            )}
          </div>

          {/* BACK */}
          <div
            className="relative border-2 border-dashed border-white/12 rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/25 hover:bg-white/2 transition-colors group"
            onClick={() => document.getElementById('backInput')?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) setBackImage(file);
            }}
          >
            <input
              id="backInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setBackImage(e.target.files?.[0] || null)}
            />

            {backImage ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-md bg-white/6 border border-white/8 flex items-center justify-center">
                  <Image size={14} className="text-white/50" />
                </div>
                <p className="text-[12px] text-white/60 text-center max-w-35 truncate">{backImage.name}</p>
                <p className="text-[10px] text-white/25">click para cambiar</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-white/4 border border-white/8 flex items-center justify-center group-hover:bg-white/6 transition-colors">
                  <Image size={14} className="text-white/30 group-hover:text-white/50 transition-colors" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <p className="text-[12px] text-white/40">Dorso de la licencia</p>
                  <p className="text-[10px] text-white/20">Arrastrá o hacé click</p>
                </div>
              </div>
            )}
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