'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ux/Button";
import { activateAccount } from "@/services/user/userService";

type Status = "success" | "error";

export default function EmailVerifiedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>();
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const verifyAccount = async () => {
      setLoading(true);

      try {
        if (!token) {
          setStatus("error");
          return;
        }

        const response = await activateAccount(token);

        setStatus(
          response.state === "OK"
            ? "success"
            : "error"
        );
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();
  }, [token]);

  

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen animate-pulse">

        {/* Ícono */}
        <div className="w-16 h-16 rounded-full bg-gray-8 border border-gray-2 mb-6" />

        {/* Título */}
        <div className="h-6 w-52 rounded bg-gray-8 mb-3" />

        {/* Descripción */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-80 rounded bg-gray-8" />
          <div className="h-4 w-64 rounded bg-gray-8 mx-auto" />
        </div>

        {/* Card */}
        <div className="w-full max-w-sm bg-gray-8 rounded-xl border border-gray-2 overflow-hidden mb-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 border-gray-2/70"
            >
              <div className="w-6 h-6 rounded-full bg-gray-7" />
              <div className="h-4 flex-1 rounded bg-gray-7" />
            </div>
          ))}
        </div>

        {/* Botón */}
        <div className="h-10 w-48 rounded-lg bg-gray-8" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">

        {/* Ícono */}
        <div className="w-16 h-16 rounded-full border border-gray-11/30 bg-gray-7 flex items-center justify-center mb-6">
          <XCircle className="w-7 h-7 text-error" />
        </div>

        {/* Título */}
        <h1 className="text-xl font-semibold text-center text-error mb-2">
          Error al activar la cuenta
        </h1>

        {/* Subtítulo */}
        <p className="text-sm text-gray-11 text-center max-w-sm leading-relaxed mb-6 font-inter">
          Hubo un problema al activar tu cuenta. Esto puede suceder si el enlace expiró o ya fue utilizado.
        </p>

        {/* Razones */}
        <div className="w-full max-w-sm bg-gray-8 rounded-xl border border-gray-2 divide-y divide-gray-2/70 mb-6">
          {[
            'El enlace puede haber expirado (48 horas)',
            'El enlace ya fue utilizado anteriormente',
          ].map((reason, index) => (
            <div key={index} className="flex items-start gap-3 px-4 py-3">
              <div className="w-6 h-6 rounded-full bg-gray-7 border border-gray-2 flex items-center justify-center shrink-0">
                <AlertCircle className="w-3.5 h-3.5 text-warning" />
              </div>
              <p className="text-sm text-gray-11 leading-relaxed font-inter">{reason}</p>
            </div>
          ))}
        </div>

        <Button onClick={() => router.push("/email-verify")}>
          Solicitar nuevo enlace
        </Button>
      </div>
    );
  }

  if(!status) return null;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      {/* Ícono */}
      <div className="w-16 h-16 rounded-full border border-gray-11/60 bg-gray-7 flex items-center justify-center mb-6">
        <CheckCircle className="w-7 h-7 text-success" />
      </div>

      {/* Título */}
      <h1 className="text-xl font-semibold text-center text-success mb-2">
        ¡Cuenta activada!
      </h1>

      {/* Subtítulo */}
      <p className="text-sm text-gray-11 text-center max-w-sm leading-relaxed mb-6 font-inter">
        Tu cuenta fue activada correctamente. Ahora podés iniciar sesión y empezar a usar todos nuestros servicios.
      </p>

      {/* Confirmaciones */}
      <div className="w-full max-w-sm bg-gray-8 rounded-xl border border-gray-2 divide-y divide-gray-2/70 mb-6">
        {[
          { label: 'Email verificado exitosamente', icon: <CheckCircle className="w-3.5 h-3.5 text-success" /> },
          { label: 'Email de bienvenida enviado', icon: <CheckCircle className="w-3.5 h-3.5 text-success" /> },
          { label: 'Ya podés iniciar sesión con tu cuenta', icon: <ArrowRight className="w-3.5 h-3.5 text-gray-11" /> },
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-3 px-4 py-3">
            <div className="w-6 h-6 rounded-full bg-gray-7 border border-gray-2 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <p className="text-sm text-gray-11 leading-relaxed font-inter">{item.label}</p>
          </div>
        ))}
      </div>

      <Button onClick={() => router.push("/login")}>
        Ir al inicio de sesión
      </Button>
    </div>
  );
}