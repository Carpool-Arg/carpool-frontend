'use client'
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { Mail, CheckCircle, Clock, XCircle, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChangePasswordEmailPage() {


  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const sendAnotherEmail = () =>{
    window.location.reload()
  }

  const goToLogin = () =>{
    router.push("/login")
  }

  const resendActivation = async (emailToSend: string) => {
    if (!emailToSend) return;
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const res = await fetch(`/api/send-change-password-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend }),
      });

      const result = await res.json();

      if (!res.ok) {
        setStatus('error');
        setError(result.message || 'Error al enviar el correo.');
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


  
   // Validar email simple
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  const handleSend = () => {
    if (!isValidEmail(email)) {
      setError('Ingresá un correo electrónico válido.');
      return;
    }
    resendActivation(email);
  };

  useEffect(() => {
  if (message || error) {
      const timer = setTimeout(() => {
      setMessage(null);
      setError(null);
      }, 5000); 
      return () => clearTimeout(timer);
  }
  }, [message, error]);


  if(status === 'success'){
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        
        <h1 className="text-2xl font-semibold mb-2 text-success">¡Correo enviado!</h1>
        
        <p className="text-gray-3 mt-4 max-w-md mb-8 font-inter">
          Revisá tu bandeja de entrada y seguí los pasos para cambiar tu contraseña.
        </p>
        <div className="flex gap-2">
          <Button 
          onClick={goToLogin}
          variant="outline"
          >
            Volver
          </Button>
          <Button 
          variant="primary"
          onClick={sendAnotherEmail}
          >
            Enviar otro correo
          </Button>
        </div>
      </div>
    )
  }

  return (
     <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8">

      <div className="flex flex-col items-center text-center w-full max-w-md">
        {/* Icono principal con animación sutil */}
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
        <div className="w-20 h-20 bg-gray-1/90 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">Cambiá tu contraseña</h1>
        

      <p className="text-gray-3 mt-4 max-w-md  font-inter">
          Ingresá tu correo electrónico para cambiar tu contraseña.
      </p>
        


          <div className="my-6 flex items-center gap-2">
            <div>
              <Input
                type="email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                />
            </div>
            
            <Button
              onClick={handleSend}
              disabled={loading}
              variant="outline"
              className=""
              >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner/>
                  Enviando...
                </span>
              ) : (
                'Enviar'
              )}
            </Button>
          </div>


        {/* Instrucciones con iconos */}
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
            <p className="text-left">Buscá el correo de cambio de contraseña (revisá spam si no lo encontras)</p>
          </div>
          
          <div className="flex items-start space-x-3 text-sm text-gray-5">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">3</span>
            </div>
            <p className="text-left">Hacé clic en el botón para cambiar tu contraseña</p>
          </div>
        </div>

        {/* Nota adicional */}
        <div className="mt-8 flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <p>El enlace expira en 30 minutos</p>
        </div>

        {(error) && (
          <div
          className="fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white 
          bg-error"
          >
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      </div>
    </div>
  );
}