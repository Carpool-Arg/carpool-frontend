
'use client'

import { ChangePasswordData, changePasswordSchema } from "@/schemas/password/passwordSchema";
import { Button } from "../ui/Button";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter} from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "../ui/Input";
import { updateEmail, updatePassword } from "@/services/userService";
import { emailSchema, UpdateEmailData, updateEmailSchema } from "@/schemas/email/emailSchema";


export default function UpdateEmailForm(){
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const emailForm = useForm<UpdateEmailData>({
        resolver: zodResolver(updateEmailSchema),
        mode: "onChange",
        defaultValues: { email:""},
    });

    const handleSubmit = async (data: UpdateEmailData) => {
        setStatus("loading");
        setMessage(null);

        try {
            await updateEmail(data);
            router.push("/email-change?email="+data.email);
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
                Cambiar correo electrónico
            </h1>

            <form
                onSubmit={emailForm.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4"
            >
                <div className="w-full">
                <Input
                    label="Correo Electrónico"
                    type="email"
                    {...emailForm.register("email")}
                    error={emailForm.formState.errors.email?.message}
                />
                </div>

                
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={!emailForm.formState.isValid}
                >
                    Confirmar
                </Button>
            </form>
            </div>
        </div>
);



}