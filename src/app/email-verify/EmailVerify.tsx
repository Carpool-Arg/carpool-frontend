'use client'
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  queryEmail: string | null
}

export default function EmailVerifyPage({ queryEmail }: Props) {
  const [email, setEmail] = useState(queryEmail || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const resendActivation = async (emailToSend: string) => {
    if (!emailToSend) return;
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const res = await fetch(`/api/resend-activation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || 'Error al reenviar el correo.');
      } else {
        setMessage('Correo reenviado correctamente.');
        setResent(true);
      }
    } catch {
      setError('Error de red al reenviar el correo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryEmail && !resent) {
      resendActivation(queryEmail);
    }
  }, [queryEmail, resent]);
  
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const obscureEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}@${domain}`;
  };

  const handleManualResend = () => {
    if (!isValidEmail(email)) {
      setError('Ingresá un correo electrónico válido.');
      return;
    }
    resendActivation(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center py-6 px-8">
      <div className="w-20 h-20 bg-gray-1/90 rounded-full flex items-center justify-center mb-4">
        <Mail className="w-10 h-10 text-primary" />
      </div>

      <h1 className="text-2xl font-semibold mb-2">Verificá tu correo</h1>
      
      {queryEmail ? (
        <p className="text-gray-3 mt-4 max-w-md  font-inter">
          Te enviamos un correo a: <strong>{obscureEmail(email)}</strong>. Revisa tu bandeja de entrada y seguí las instrucciones.
        </p>
      ) : (
        <p className="text-gray-3 mt-4 max-w-md  font-inter">
          Ingresá tu correo electrónico para reenviar el enlace de verificación.
        </p>
      )}

      {!queryEmail &&(
        <div className="my-6 flex items-center gap-2">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error || ''}
              placeholder="example@gmail.com"
            />
          </div>
          
          <Button
            onClick={handleManualResend}
            disabled={loading}
            variant="outline"
          >
            Reenviar
          </Button>
        </div>
      )}

      <div className="flex flex-col items-start space-y-4 max-w-md font-inter mt-4 px-4">
        <div className="flex items-start space-x-3 text-sm text-gray-5">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 ">
            <span className="text-xs font-semibold text-primary">1</span>
          </div>
          <p className="text-left">Abrí tu aplicación de correo electrónico</p>
        </div>
        
        <div className="flex items-start space-x-3 text-sm text-gray-5">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 ">
            <span className="text-xs font-semibold text-primary">2</span>
          </div>
          <p className="text-left">Buscá el correo de verificación (revisá spam si no lo encontras)</p>
        </div>
        
        <div className="flex items-start space-x-3 text-sm text-gray-5">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary">3</span>
          </div>
          <p className="text-left">Hacé clic en el botón de activación</p>
        </div>
      </div>

      <div className="mt-8 flex items-center space-x-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <p>El enlace expira en 48 horas</p>
      </div>

      {loading && <p className="mt-4 text-primary">Reenviando correo...</p>}
      {message && <p className="mt-4 text-success">{message}</p>}

      {queryEmail && (
        <Button
          onClick={handleManualResend}
          disabled={loading}
          variant="outline"
          className="mt-6 text-sm"
        >
          ¿No recibiste el correo? Reenviar
        </Button>
      )}
    </div>
  );
}