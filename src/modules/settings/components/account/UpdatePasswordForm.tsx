'use client'

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ux/Button";
import { Input } from "@/components/ux/Input";
import { Alert } from "@/components/ux/Alert";
import { Toast } from "@/components/ux/Toast";
import { updatePassword } from "@/services/user/userService";
import { UpdatePasswordData, updatePasswordSchema } from "../../schemas/updatePasswordSchema";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const passwordsForm = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onChange",
    defaultValues: { newPassword: "", confirmNewPassword: "", oldPassword: "" },
  });

  // Revalidar confirmNewPassword cuando cambia  el newPassword
  useEffect(() => {
    const subscription = passwordsForm.watch((_, { name }) => {
      if (name === "newPassword") {
        passwordsForm.trigger("confirmNewPassword");
      }
    });
    return () => subscription.unsubscribe();
  }, [passwordsForm]);

  // Mostrar errores solo si el campo tiene contenido
  const confirmValue = passwordsForm.watch("confirmNewPassword");
  const confirmError = confirmValue
    ? passwordsForm.formState.errors.confirmNewPassword?.message
    : undefined;

  const handleSubmit = async (data: UpdatePasswordData) => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const response = await updatePassword(data);
      if (response.state === "ERROR") {
        setToast({ message: response.messages[0], type: 'error' });
        setLoading(false);
        return;
      }
      router.push("/settings");
    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      setToast({ message: 'Ocurrió un error inesperado', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen py-6 px-4 sm:px-8">
      <div className="w-full max-w-md rounded-xl shadow p-6 ">
        <h1 className="text-2xl font-semibold mb-6 text-left">
          Cambiar contraseña
        </h1>
        {errorMessage && (
          <Alert type="error" message={errorMessage} />
        )}
        <form
          onSubmit={passwordsForm.handleSubmit(handleSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="w-full">
            <Input
              label="Contraseña anterior"
              type="password"
              {...passwordsForm.register("oldPassword")}
              error={passwordsForm.formState.errors.oldPassword?.message}
            />
          </div>
          <div className="w-full">
            <Input
              label="Nueva Contraseña"
              type="password"
              {...passwordsForm.register("newPassword")}
              error={passwordsForm.formState.errors.newPassword?.message}
            />
          </div>
          <div className="w-full">
            <Input
              label="Confirmar nueva contraseña"
              type="password"
              {...passwordsForm.register("confirmNewPassword")}
              error={confirmError}
            />
          </div>
          <div className="px-1 w-full text-xs text-left">
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Al menos 8 caracteres</li>
              <li>Al menos 1 mayúscula</li>
              <li>Al menos 1 número</li>
            </ul>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!passwordsForm.formState.isValid || loading}
          >
            {loading ? "Procesando..." : "Confirmar"}
          </Button>
        </form>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
