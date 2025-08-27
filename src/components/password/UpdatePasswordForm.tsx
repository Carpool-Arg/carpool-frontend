'use client'

import { ChangePasswordData, changePasswordSchema } from "@/schemas/password/passwordSchema";
import { CheckCircle, LockKeyhole, XCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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
        <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8">
            <div className="flex flex-col items-center text-center w-full max-w-md">

                <div className="w-20 h-20 bg-gray-1/90 rounded-full flex items-center justify-center mb-4">
                    <LockKeyhole className="w-10 h-10 text-primary" />
                </div>

                <h1 className="text-2xl font-semibold mb-2"></h1>

                <form onSubmit={passwordsForm.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col text-start gap-4">
                        <div className="w-80">
                            <Input
                                label="Contraseña anterior"
                                type="password"
                                {...passwordsForm.register("oldPassword")}
                                error={passwordsForm.formState.errors.oldPassword?.message}
                            />
                        </div>
                        <div className="w-80">
                            <Input
                                label="Nueva Contraseña"
                                type="password"
                                {...passwordsForm.register("newPassword")}
                                error={passwordsForm.formState.errors.newPassword?.message}
                            />
                        </div>

                        <div>
                            <Input
                                label="Confirmar nueva contraseña"
                                type="password"
                                {...passwordsForm.register("confirmNewPassword")}
                                error={passwordsForm.formState.errors.confirmNewPassword?.message}
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