'use client'

import { useEffect, useState } from "react"
import { Clock, Mail, XCircle, Send, CheckCircle } from "lucide-react"
import { Input } from "@/components/ux/Input"
import { Button } from "@/components/ux/Button"

type MailFormProps = {
  queryEmail: boolean
  title: string
  subtitle: string
  buttonText: string
  tokenExpiration: string
  paramMail?: string
  onResend: (email: string) => Promise<void>
}

export default function MailForm({
  queryEmail,
  title,
  subtitle,
  buttonText,
  tokenExpiration,
  paramMail,
  onResend,
}: MailFormProps) {
  const [email, setEmail] = useState<string>('')
  const [cooldown, setCooldown] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const [hasQueryEmail, setHasQueryEmail] = useState<boolean>(queryEmail)
  const [initialMail, setInitialMail] = useState<string>(paramMail || '')

  const handleResend = async () => {
    const targetEmail = hasQueryEmail ? initialMail : email

    if (!targetEmail) {
      setError('Ingresá un correo válido')
      return
    }

    setError('')
    setLoading(true)
    setMessage('')

    try {
      await onResend(targetEmail)
      setMessage('Correo enviado correctamente.')
      setCooldown(30)
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error: unknown) {
      setError('Hubo un problema al reenviar el correo.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSend = async () => {
    if (!isValidEmail(email)) {
      setError('Ingresá un correo electrónico válido.')
      return
    }
    try {
      await handleResend()
      setHasQueryEmail(true)
      setInitialMail(email)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('')
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, error])

  const obscureEmail = (email: string) => {
    const [user, domain] = email.split('@')
    return `${user[0]}***@${domain}`
  }

  const steps = [
    'Abrí tu aplicación de correo electrónico',
    'Buscá el correo de verificación',
    'Hacé clic en el botón de activación del correo',
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      {/* Ícono */}
      <div className="w-16 h-16 rounded-full border border-gray-11/60 bg-gray-7 flex items-center justify-center mb-6">
        <Mail className="w-7 h-7 text-gray-11" />
      </div>

      {/* Título */}
      <h1 className="text-xl font-semibold text-center mb-2">{title}</h1>

      {/* Subtítulo */}
      <p className="text-sm text-gray-11 text-center max-w-sm leading-relaxed mb-6 font-inter">
        {hasQueryEmail && initialMail
          ? <>Te enviamos un correo a{' '}<span className="font-medium text-white">{obscureEmail(initialMail)}</span>. Revisá tu bandeja de entrada.</>
          : subtitle}
      </p>

      {/* Input si no hay email */}
      {!hasQueryEmail && (
        <div className="flex items-center gap-2 w-full max-w-sm mb-6">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={loading || cooldown > 0}
            variant="outline"
            className="flex-1"
          >
            {cooldown > 0 ? `Reenviar en ${cooldown}s` : buttonText}
          </Button>
        </div>
      )}

      {/* Pasos */}
      <div className="w-full max-w-sm bg-gray-8 rounded-xl border border-gray-2 divide-y divide-gray-2/70 mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3 px-4 py-3">
            <div className="w-6 h-6 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-gray-10">{index + 1}</span>
            </div>
            <p className="text-sm text-gray-11 leading-relaxed font-inter">{step}</p>
          </div>
        ))}
      </div>

      {/* Expiración */}
      <div className="flex items-center gap-1.5 text-xs text-gray-11/75 mb-6">
        <Clock className="w-3.5 h-3.5" />
        <span>El enlace expira en {tokenExpiration}</span>
      </div>

      {/* Estado de carga y éxito */}
      {loading && hasQueryEmail && (
        <p className="text-sm text-gray-400 mb-3">Reenviando correo...</p>
      )}

      {message && hasQueryEmail && (
        <div className="flex items-center gap-2 text-sm text-success mb-3">
          <CheckCircle className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Botón de reenvío */}
      {hasQueryEmail && (
        <Button
          onClick={handleResend}
          disabled={loading || cooldown > 0}
          variant="outline"
          className="flex items-center gap-2 text-sm"
        >
          <Send className="w-3.5 h-3.5" />
          {cooldown > 0 ? `Reenviar en ${cooldown}s` : buttonText}
        </Button>
      )}

      {/* Toast de error */}
      {error && (
        <div className="fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm shadow-sm">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}