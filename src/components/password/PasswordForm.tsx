'use client'

import { CheckCircle, LockKeyhole, XCircle } from "lucide-react";
import { Button } from "../ui/ux/Button";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/ux/Input";
import { ResetPasswordData, resetPasswordSchema } from "@/schemas/password/passwordSchema";

type PasswordFormdProps = {
  title: string;
  successTitle: string;
  successMessage: string;
  onSubmit: (data: ResetPasswordData & { token: string }) => Promise<any>;
}

export default function PasswordForm({
  title,
  successTitle,
  successMessage,
  onSubmit
}: PasswordFormdProps){
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const passwordsForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No se ha proporcionado un token válido.");
    }
  }, [token]);

  const handleSubmit = async (data: ResetPasswordData) => {
    setStatus("loading");
    setMessage(null);
    if (!token) {
      setStatus("error");
      setMessage("No se ha proporcionado un token.");
      return;
    }

    try {
      const completeData = { ...data, token };
      const response = await onSubmit(completeData)
      console.log('response',response)

      if(response.state === "ERROR" ){
        setStatus('error')
        setMessage(response.messages?.[0] || "Error inesperado.");
        return;
      }
      setStatus('success')
      setMessage(successMessage)
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      setStatus("error");
      setMessage(message || "Ocurrió un problema.");
    }
  };

  const goToLogin = () => router.push("/login");

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-semibold mb-2 text-success">{successTitle}</h1>
        <p className="text-gray-3 mt-4 max-w-md mb-8 font-inter">{successMessage}</p>
        <Button variant="outline" onClick={goToLogin}>
          Volver
        </Button>
      </div>
    );
  }

  if (status === "error" || !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-10 h-10 text-error" />
        </div>
        <h1 className="text-2xl font-semibold mb-2 text-error">Ups… ocurrió un problema</h1>
        <p className="text-gray-3 mt-4 max-w-md font-inter">No pudimos cambiar tu contraseña. Por favor, vuelve a intentarlo más tarde.</p>
        <p className="text-gray-3 max-w-md mb-8 mt-2 font-inter">{message}</p>
        <Button variant="outline" onClick={goToLogin}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8">
      <div className="flex flex-col items-center text-center w-full max-w-md">
        <div className="w-20 h-20 bg-gray-1/90 rounded-full flex items-center justify-center mb-4">
          <LockKeyhole className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">{title}</h1>

        <form onSubmit={passwordsForm.handleSubmit(handleSubmit)}>
          <div className="flex flex-col text-start gap-4">
            <div className="w-80">
              <Input
                label="Nueva Contraseña"
                type="password"
                {...passwordsForm.register("password")}
                error={passwordsForm.formState.errors.password?.message}
              />
            </div>

            <div>
              <Input
                label="Confirmar nueva contraseña"
                type="password"
                {...passwordsForm.register("confirmPassword")}
                error={passwordsForm.formState.errors.confirmPassword?.message}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={!passwordsForm.formState.isValid}
            >
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}