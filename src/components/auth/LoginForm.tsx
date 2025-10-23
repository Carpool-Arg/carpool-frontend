'use client'

import { useState } from "react"
import { Button } from "../ui/ux/Button"
import { Input } from "../ui/ux/Input"
import { useForm } from "react-hook-form"
import { LoginData, loginSchema } from "@/schemas/auth/loginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuth } from "@/contexts/authContext" 
import Spinner from "../ui/ux/Spinner"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { Alert } from "../ui/ux/Alert"
import Link from "next/link"


export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const { login, loading, authGoogle } = useAuth()
  const { executeRecaptcha } = useGoogleReCaptcha()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: ''
    }
  })
  

  const onSubmit = async (data: LoginData) => {
    setError(null);
    try {
      // Ejecutar reCAPTCHA
      if (!executeRecaptcha) {
        setError('reCAPTCHA no está disponible')
        return
      }

      //Obtener el token de recaptcha, pasando el action login, para saber que estamos haciendo
      const gRecaptchaToken = await executeRecaptcha('login')
      
      if (!gRecaptchaToken) {
        setError('Error al validar reCAPTCHA')
        return
      }
      
      //Crear un nuevo objeto con los datos del login y el captcha, para iniciar sesion
      await login({ ...data, recaptchaToken: gRecaptchaToken })

      
    } catch (error: unknown) {
      let message = "Error desconocido";

      if (error instanceof Error) {
        message = error.message;
      }
      setError(message || 'Error al iniciar sesión');
    }
  }

  const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Error: no se recibió credencial de Google')
      return
    }

    setError(null)
    try {
      await authGoogle(credentialResponse.credential)
    } catch (error: unknown) {
      let message = "Error desconocido";

      if (error instanceof Error) {
        message = error.message;
      }
      setError(message || 'Error al iniciar sesión con Google')
    }
  }

  const onGoogleError = () => {
    setError('Error en autenticación con Google')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full md:py-6">
      <div className="flex flex-col items-center text-center mb-2">
        <h1 className="font-outfit text-lg font-semibold">Inicia sesión en tu cuenta</h1>
        <p className="font-inter font-regular text-sm">Ingresa email y contraseña para iniciar sesión</p>
      </div>
      {error && <Alert message={error} />}
      <div className="flex flex-col">
        <Input
          label="Nombre de usuario"
          type="text"
          autoComplete="username"
          {...register('username')}
          error={errors.username?.message}
        />
      </div>

      <div className="flex flex-col">
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          error={errors.password?.message}
        />
      </div>

      <Link href="/password-change/send-email" className="flex justify-start hover:underline cursor-pointer text-sm font-inter">
        ¿Olvidaste tu contraseña?
      </Link>

      <Button
        variant="primary"
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner size={20} />
            Iniciando sesión...
          </span>
        ) : (
          'Iniciar sesión'
        )}
      </Button>

      <p className="flex justify-start items-center text-sm gap-1 font-inter">
        ¿No tenes cuenta?
        <Link href="/register" className="flex justify-start hover:underline cursor-pointer font-medium">
         Registrate acá
        </Link>
      </p>
      

      <div className="flex items-center gap-2 text-gray-500">
        <div className="flex-1 h-px bg-gray-4/50" />
        <span className="text-sm font-inter">o</span>
        <div className="flex-1 h-px bg-gray-4/50" />
      </div>
      
      <GoogleLogin
        onSuccess={onGoogleSuccess}
        onError={onGoogleError}
        text="continue_with"
        shape="pill"
        size="large"
        width="100%"
      />

      
     

      <p className="w-full text-center text-sm text-gray-4 font-inter">
        Al hacer clic en continuar, aceptás nuestros
        <a href="/terms" className="mx-1 text-dark-2 dark:text-gray-1 font-medium">Términos de Servicio</a>
        y
        <a href="/privacy" className="text-dark-2 dark:text-gray-1 font-medium ml-1">Política de Privacidad</a>.
      </p>
      


      
    </form>
  )
}