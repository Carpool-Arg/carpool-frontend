'use client'
import MailForm from "@/components/mail/MailForm";
import { Button } from "@/components/ui/ux/Button";
import { sendChangePasswordEmail } from "@/services/emailService";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SendChangePasswordEmailPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null);

  const resendActivation = async (emailToSend: string) => {
    if (!emailToSend) return;
    try {
      setLoading(true);
      setMessage(null);

      const response = await sendChangePasswordEmail(emailToSend);

      if (response.state === 'ERROR') {
        setStatus('error');
        setError(response.messages?.[0] || 'Error al enviar el correo.');
      } else {
        setStatus('success');
        setMessage('Correo enviado correctamente.');
      }
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      setStatus('error')
      setMessage(`${message}`||'Ocurrió un problema.')
      setError('Error de red al enviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MailForm
      queryEmail={false}
      title="Cambia tu contraseña"
      subtitle="Ingresá tu correo electrónico para cambiar tu contraseña."
      buttonText="Enviar"
      tokenExpiration="30 minutos"
      onResend={async (email) => {
        resendActivation(email)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }}
    />
  );
}