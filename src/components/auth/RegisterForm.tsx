'use client'

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerUser } from "@/services/authService"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { useRouter } from "next/navigation"
import { 
  registerStep1Schema, 
  registerStep2Schema, 
  type RegisterStep1Data,
  type RegisterStep2Data,
  type CompleteRegisterData
} from "@/schemas/auth/registerSchema"
import Spinner from "../ui/Spinner"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google"
import { useAuth } from "@/contexts/authContext"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Check, X } from 'lucide-react'
import { Alert } from "../ui/Alert"
import { useFieldValidator } from "@/hooks/useFieldValidator";

const genders = [
  { label: "Masculino", value: "MALE" },
  { label: "Femenino", value: "FEMALE" },
  { label: "Otro", value: "UNSPECIFIED" },
];

export function RegisterForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { authGoogle } = useAuth()
  const { executeRecaptcha } = useGoogleReCaptcha()


  // Form para el paso 1
  const step1Form = useForm<RegisterStep1Data>({
    resolver: zodResolver(registerStep1Schema),
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  // Form para el paso 2
  const step2Form = useForm<RegisterStep2Data>({
    resolver: zodResolver(registerStep2Schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      lastname: '',
      dni: '',
      phone: '',
      gender:'UNSPECIFIED'
    }
  })

  const usernameValidation = useFieldValidator('username');
  const emailValidation = useFieldValidator('email');
  const dniValidation = useFieldValidator('dni');

  //  observador del input, se activa cuando el value del input cambia
  // Watch para campos de step1Form: username y email
  useEffect(() => {
    const subscription = step1Form.watch((value, { name }) => {
      if (name === "username" && value.username) {
        usernameValidation.validate(value.username);
      } else if (name === "email" && value.email) {
        emailValidation.validate(value.email);
      }
    });
    return () => subscription.unsubscribe();
  }, [step1Form, usernameValidation, emailValidation]);

  // Watch para campo de step2Form: dni
  useEffect(() => {
    const subscription = step2Form.watch((value, { name }) => {
      if (name === "dni" && value.dni) {
        dniValidation.validate(value.dni);
      }
    });
    return () => subscription.unsubscribe();
  }, [step2Form, dniValidation]);


  const getRightIcon = (validation: ReturnType<typeof useFieldValidator>) => {
    if (validation.checking) return <Spinner size={16} />;
    if (validation.available === true) return <Check className="w-4 h-4 text-success" />;
    if (validation.available === false) return <X className="w-4 h-4 text-error" />;
    return null;
  };

  // Maneja el siguiente paso
  const handleNext = async () => {
    setError(null)
    setStep(2)
  }

  const handlePrev = () => {
    setError(null)          // limpia errores globales
    setStep(1)              // vuelve al paso anterior
  }

  // Maneja el envío final
  const handleSubmit = async (data: RegisterStep2Data) => {
    setLoading(true)
    setError(null)

    try {
      // Combinar datos de ambos pasos
      const step1Data = step1Form.getValues()
      const completeData: CompleteRegisterData = {
        ...step1Data,
        ...data
      }
      console.log('complete data register',completeData)
      // Ejecutar reCAPTCHA
      if (!executeRecaptcha) {
        setError('reCAPTCHA no está disponible')
        return
      }

      //Obtener el token de recaptcha, pasando el action signup, para saber que estamos haciendo
      const gRecaptchaToken = await executeRecaptcha('signup')

      if (!gRecaptchaToken) {
        setError('Error al validar reCAPTCHA')
        return
      }

      const response = await registerUser({...completeData, recaptchaToken: gRecaptchaToken})
      console.log('response register',response)
      if (!response.success) {
        setError(response.message || "Error al registrar usuario")
        return
      }

      router.push(`/email-verify?email=${completeData.email}`)
    } catch {
      setError('Error al registrar usuario')
    } finally {
      setLoading(false)
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

  const genderLabels: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    UNSPECIFIED: "No especificado",
  };
  
  return (
    <div className="flex flex-col gap-4 p-6 w-full">
      <div className="flex flex-col items-center text-center mb-2">
        <h1 className="font-outfit text-lg font-semibold">Crear una cuenta</h1>
        {step === 1 && (
          <p className="font-inter font-regular text-sm">
            Registrate con tu email, nombre de usuario y contraseña
          </p>
        )}
        {step === 2 && (
          <p className="font-inter font-regular text-sm">
            Completá tus datos personales para finalizar el registro
          </p>
        )}
      </div>

      {step === 1 && (
        <form onSubmit={step1Form.handleSubmit(handleNext)} className="flex flex-col gap-4">
          {error && <Alert message={error} />}
          <div>
            <Input
              label="Nombre de usuario"
              type="text"
              {...step1Form.register('username')}
              error={step1Form.formState.errors.username?.message}
              rightIcon={getRightIcon(usernameValidation)}
              className="font-outfit"
            />
            {usernameValidation.message && (
              <p className={`text-xs font-inter mt-1 ${
                usernameValidation.messageType === 'success' ? 'text-success' : 'text-error'
              }`}>
                {usernameValidation.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Correo electrónico"
              type="email"
              {...step1Form.register('email')}
              error={step1Form.formState.errors.email?.message}
              rightIcon={getRightIcon(emailValidation)}
              className="font-outfit"
            />

            {emailValidation.message && (
              <p className={`text-xs font-inter mt-1 ${
                emailValidation.messageType === 'success' ? 'text-success' : 'text-error'
              }`}>
                {emailValidation.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Contraseña"
              type="password"
              {...step1Form.register('password')}
              error={step1Form.formState.errors.password?.message}
              
            />
          </div>

          <div>
            <Input
              label="Confirmar contraseña"
              type="password"
              {...step1Form.register('confirmPassword')}
              error={step1Form.formState.errors.confirmPassword?.message}
              
            />
          </div>

          <Button variant="primary" type="submit" className="w-full">
            Continuar
          </Button>

          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex-1 h-px bg-gray-4/50" />
            <span className="text-sm font-inter">o</span>
            <div className="flex-1 h-px bg-gray-4/50" />
          </div>

          
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={onGoogleError}
            text="signup_with"
            shape="rectangular"
            size="large"
            width="100%"
          />
          

          <p className="w-full text-center text-sm text-gray-500 font-inter">
            Al hacer clic en continuar, aceptás nuestros
            <a href="/terms" className="mx-1 text-dark-2 font-medium">Términos de Servicio</a>
            y
            <a href="/privacy" className="text-dark-2 font-medium ml-1">Política de Privacidad</a>.
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={step2Form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
          {error && <Alert message={error} />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Nombre"
                type="text"
                {...step2Form.register('name')}
                error={step2Form.formState.errors.name?.message}
              />
            </div>
            <div>
              <Input
                label="Apellido"
                type="text"
                {...step2Form.register('lastname')}
                error={step2Form.formState.errors.lastname?.message}
              />
            </div>
          </div>

          <div>
            <Input
              label="DNI"
              type="text"
              {...step2Form.register('dni')}
              error={step2Form.formState.errors.dni?.message}
              rightIcon={getRightIcon(dniValidation)}
              className="font-outfit"
            />
            {dniValidation.message && (
              <p className={`text-xs font-inter mt-1 ${
                dniValidation.messageType === 'success' ? 'text-success' : 'text-error'
              }`}>
                {dniValidation.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Teléfono"
              type="tel"
              {...step2Form.register('phone')}
              error={step2Form.formState.errors.phone?.message}
            />
          </div>

          <div>
            <label htmlFor="gender" className="block mb-1 font-medium text-sm font-outfit">Género</label>
            <select
              id="gender"
              {...step2Form.register('gender', { required: "El género es obligatorio" })}
              className={`w-full rounded-md border px-3 py-2 font-outfit text-sm ${
                step2Form.formState.errors.gender ? 'border-error' : 'border-gray-300'
              }`}
              defaultValue=""
            >
              <option value="" disabled>Seleccioná un género</option>
              {genders.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
            </select>
            {step2Form.formState.errors.gender && (
              <p className="text-error text-xs mt-1">{step2Form.formState.errors.gender.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" className="w-full" onClick={handlePrev}>
              Atrás
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || step2Form.formState.isSubmitting}
            >
              {loading ? <Spinner size={20} /> : 'Registrarse'}
            </Button>
          </div>
        </form>
      )}

    </div>
  )
}