'use client'

import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { ChevronLeft, Clock, Mail, XCircle } from "lucide-react"
import { Input } from "../ui/Input"
import Link from "next/link"
import Image from "next/image"

type MailFormProps = {
    queryEmail: boolean
    title: string 
    subtitle: string
    buttonText: string
    tokenExpiration: string
    paramMail?:string
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
}: MailFormProps){
    const [email, setEmail] = useState('')
    const [cooldown,setCooldown] = useState(0)
    const [loading,setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error,setError] = useState('')
    
    const handleResend = async()  => {
        if(!email && !queryEmail){
            setError('Ingresá un correo válido')
            return
        }
        setError('')
        setLoading(true)
        setMessage('')

        try {
            await onResend(email)
            setMessage('Correo enviado correctamente.')
            setCooldown(30) // ejemplo de cooldown en segundos
            const interval = setInterval(() => {
                setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
                })
            }, 1000)
            } catch (err) {
            setError('Hubo un problema al reenviar el correo.')
            } finally {
            setLoading(false)
        }
    }

    

    const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


    const handleSend = () => {
        if (!isValidEmail(email)) {
        setError('Ingresá un correo electrónico válido.');
        return;
        }
        handleResend();
    };

    useEffect(() => {
    if (message || error) {
        const timer = setTimeout(() => {
        setMessage('');
        setError('');
        }, 5000); 
        return () => clearTimeout(timer);
    }
    }, [message, error]);

    const obscureEmail = (email: string) => {
        const [user, domain] = email.split('@')
        return `${user[0]}***@${domain}`
    }

    return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center py-6 px-8">
        <div className="flex flex-col w-full justify-start mb-4 space-y-2">
          <Link href="/login" className="flex items-center text-sm hover:text-gray-3">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Volver
          </Link>
          <Image
            src="/isologo.webp"
            alt="Logo de Carpool"
            width={50}
            height={50}
            className="mb-4"
            />
        </div>
      {/* Icono */}
      <div className="w-20 h-20 bg-gray-1/90 rounded-full flex items-center justify-center mb-4">
        <Mail className="w-10 h-10 text-primary" />
      </div>

      {/* Título y subtítulo */}
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="text-gray-3 mt-4 max-w-md font-inter">
        {(queryEmail && paramMail)
          ? `Te enviamos un correo a: ${obscureEmail(paramMail)}. Revisa tu bandeja de entrada.`
          : subtitle}
      </p>

      {/* Input y botón si no hay queryEmail */}
      {!queryEmail && (
          <div className="my-6 flex items-center gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            />
          <Button
            onClick={handleSend}
            disabled={loading || cooldown > 0}
            variant="outline"
            >
            {cooldown > 0 ? `Reenviar en ${cooldown}s` : buttonText}
          </Button>
        </div>
      )}

      {/* Pasos */}
      <div className="flex flex-col items-start space-y-4 max-w-md font-inter mt-4 px-4">
        {['Abrí tu aplicación de correo electrónico', 'Buscá el correo de verificación (revisá spam)', 'Hacé clic en el botón de activación'].map(
            (step, index) => (
                <div
                key={index}
                className="flex items-start space-x-3 text-sm text-gray-5"
                >
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary">
                  {index + 1}
                </span>
              </div>
              <p className="text-left">{step}</p>
            </div>
          )
        )}
      </div>

      {/* Tiempo de expiración */}
      <div className="mt-8 flex items-center space-x-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <p>El enlace expira en {tokenExpiration}.</p>
      </div>

      {/* Mensajes */}
      {(loading && queryEmail)  && <p className="mt-4 text-primary">Reenviando correo...</p>}
      {(message && queryEmail) && <p className="mt-4 text-success">{message}</p>}
        {(error) && (
            <div
                className="fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white 
                bg-error"
                >
                <XCircle className="w-5 h-5" />
                <span>{error}</span>
            </div>
        )}

      {/* Botón secundario si hay queryEmail */}
      {queryEmail && (
          <Button
          onClick={handleResend}
          disabled={loading || cooldown > 0}
          variant="outline"
          className="mt-6 text-sm"
          >
          {cooldown > 0 ? `Reenviar en ${cooldown}s` : buttonText}
        </Button>
      )}
    </div>
  )


    
    
}