'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

type Props = {
  token: string | null
}

export default function EmailVerifiedPage({ token }: Props) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/users/activate-account`, {
          method: 'POST',
          body: JSON.stringify({ token }),
        })

        if (res.ok) {
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }

    verify()
  }, [token])

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-semibold mb-2 text-success">¡Cuenta activada!</h1>
        <p className="text-gray-3 mt-4 max-w-md mb-8 font-inter">
          Tu cuenta fue activada correctamente. Ahora podés iniciar sesión y empezar a usar todos nuestros servicios.
        </p>
        <div className="space-y-3 max-w-md font-inter">
          <div className="flex items-center space-x-3 text-sm text-gray-5">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-success" />
            </div>
            <p className="text-left">Email verificado exitosamente</p>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-5">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">→</span>
            </div>
            <p className="text-left">Ya podés iniciar sesión con tu cuenta</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="mt-8 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Ir al inicio de sesión
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-10 h-10 text-error" />
      </div>
      <h1 className="text-2xl font-semibold mb-2 text-error">Error al activar la cuenta</h1>
      <p className="text-gray-3 mt-4 max-w-md mb-8 font-inter">
        Hubo un problema al activar tu cuenta. Esto puede suceder si el enlace expiró o ya fue utilizado.
      </p>
      <div className="space-y-3 max-w-md font-inter mb-8">
        <div className="flex items-center space-x-3 text-sm text-gray-5">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-left">El enlace puede haber expirado (48 horas)</p>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-5">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
          <p className="text-left">El enlace ya fue utilizado anteriormente</p>
        </div>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => router.push('/login')}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Solicitar nuevo enlace
        </button>
      </div>
    </div>
  )
}
