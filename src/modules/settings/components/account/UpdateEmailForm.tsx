'use client'

import { updateEmail } from "@/services/user/userService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ux/Button";
import { Input } from "@/components/ux/Input";
import { UpdateEmailData, updateEmailSchema } from "../../schemas/updateEmailSchema";
import { useState } from "react";
import { Toast } from "@/components/ux/Toast";
import Spinner from "@/components/ux/Spinner";

export default function UpdateEmailForm(){
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'error' | 'warning' } | null>(null)
    
    const { 
        register, 
        handleSubmit, 
        watch, 
        formState: { errors, isValid } 
    } = useForm<UpdateEmailData>({
        resolver: zodResolver(updateEmailSchema),
        mode: "onChange",
        defaultValues: { email: "" },
    });

    const emailValue = watch("email");

    const onSubmit = async (data: UpdateEmailData) => {
        setLoading(true);
        try {
            const response = await updateEmail(data);

            if (response.state === "ERROR") {
                const rawMessage = response.messages[0];
                const friendlyMessage = (rawMessage?.includes("JSON") || rawMessage?.includes("Unexpected") || !rawMessage) 
                    ? "Ocurrió un error inesperado." 
                    : rawMessage;

                setToast({ message: friendlyMessage, type: 'error' });
                return; 
            }
            router.push("/email-change?email=" + data.email);
        } catch (error: unknown) {
            let message = "Ocurrió un error inesperado.";
            if (error instanceof Error) message = error.message;
            setToast({ message: message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center min-h-screen py-6 px-4 sm:px-8">
            <div className="w-full max-w-md rounded-xl shadow p-6">
                <h1 className="text-2xl font-semibold mb-6 text-left">
                    Cambiar correo electrónico
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="w-full">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            {...register("email")}
                            error={emailValue !== "" ? errors.email?.message : undefined}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full flex items-center justify-center"
                        disabled={!isValid || loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Spinner size={20} />
                                <span>Cargando...</span>
                            </div>
                        ) : 'Confirmar'}
                    </Button>
                </form>
            </div>
            {toast && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[90%] sm:max-w-md pointer-events-none flex justify-center">
                    <div className="pointer-events-auto w-full">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => setToast(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}