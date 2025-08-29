'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { completeRegistrationSchema, CompleteRegistrationData } from "@/schemas/auth/completeRegistrationSchema"
import { completeRegistration } from "@/services/authService"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import Spinner from "../ui/Spinner"

interface CompleteRegistrationFormProps {
  email: string
}

export function CompleteRegistrationForm({email}:CompleteRegistrationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteRegistrationData>({
    resolver: zodResolver(completeRegistrationSchema),
  })

  const onSubmit = async (data: CompleteRegistrationData) => {
    setLoading(true)
    setError(null)
    try {
      await completeRegistration(email,data)
      router.push('/email-verify')
    } catch {
      setError('Error al registrar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        {/* Nombre de usuario solo */}
        <Input
          label="Nombre de usuario"
          type="text"
          {...register("username")}
          error={errors.username?.message}
        />

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Apellido"
            type="text"
            {...register("lastname")}
            error={errors.lastname?.message}
          />
        </div>

        {/* DNI y Teléfono */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="DNI"
            type="text"
            {...register("dni")}
            error={errors.dni?.message}
          />

          <Input
            label="Teléfono"
            type="tel"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>

        {/* Contraseña y Confirmar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Contraseña"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button variant="primary" type="submit" className="w-full mt-4" disabled={loading || isSubmitting}>
          {loading ? <Spinner size={20} /> : "Registrarse"}
        </Button>

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </form>
    </div>
  )
}