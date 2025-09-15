'use client'

import { ChangePasswordData, changePasswordSchema } from "@/schemas/password/passwordSchema";
import { Button } from "../ui/Button";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter} from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import { updatePassword } from "@/services/userService";


export default function UpdatePasswordForm(){
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const passwordsForm = useForm<ChangePasswordData>({
        resolver: zodResolver(changePasswordSchema),
        mode: "onChange",
        defaultValues: { newPassword: "", confirmNewPassword: "" , oldPassword: ""},
    });

    const handleSubmit = async (data: ChangePasswordData) => {
        setStatus("loading");
        setMessage(null);

        try {
            await updatePassword(data);
            router.push("/settings");
        } catch (error: unknown) {
            let message = "Error desconocido";
            if (error instanceof Error) message = error.message;
            setStatus("error");
            setMessage(message || "Ocurrió un problema.");
        }
    };


    return (
        <div className="flex justify-center min-h-screen py-6 px-4 sm:px-8">
            <div className="w-full max-w-md rounded-xl shadow p-6 ">
            {/* Título siempre a la izquierda */}
            <h1 className="text-2xl font-semibold mb-6 text-left">
                Cambiar contraseña
            </h1>

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
                    error={passwordsForm.formState.errors.confirmNewPassword?.message}
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
                disabled={!passwordsForm.formState.isValid}
                >
                Confirmar
                </Button>
            </form>
            </div>
        </div>
);



}