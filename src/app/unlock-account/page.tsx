'use client'

import PasswordForm from "@/components/password/PasswordForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ChangePasswordData, changePasswordSchema } from "@/schemas/change-password/changePasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, ChevronLeft, LockKeyhole, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function PasswordChangePage(){

    return (
        <PasswordForm
        title="Recuperá tu cuenta"
        successTitle="¡Cuenta recuperada correctamente!"
        successMessage="Se actualizó tu contraseña, puedes volver a intentar iniciar sesión"
        endpoint="/api/users/unlock-account"
        />
    );
    // const searchParams = useSearchParams();
    // const token = searchParams.get('token');
    // const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    // const [message, setMessage] = useState<string | null>(null);
    // const router = useRouter();

    // const passwordsForm = useForm<ChangePasswordData>({
    //     resolver: zodResolver(changePasswordSchema),
    //     mode: 'onChange',
    //     defaultValues:{
    //         password: '',
    //         confirmPassword:''
    //     }
    // })

    // useEffect(()=>{
    //     if(!token){
    //         setStatus("error");
    //         setMessage("No se ha proporcionado un token válido.")
    //     }
    // }, [token]);

    // const goToLogin = () =>{
    //     router.push("/login")
    // }
    // const handleSubmit = async (data: ChangePasswordData)=>{
    //     setStatus('loading')
    //     setMessage(null)
    //     if(!token){
    //         setStatus('error')
    //         setMessage('No se ha proporcionado un token.')
    //         return
    //     }

    //     try{
    //         const completeData = {
    //             ...data,
    //             token
    //         }
    //         const headers: Record<string, string> = {
    //             'Content-Type': 'application/json',
    //         };

    //         const response = await fetch('/api/users/unlock-account',{
    //             method: 'POST',
    //             headers,
    //             body: JSON.stringify(completeData),

    //         })

    //         const responseBody =await response.json();

    //         if (!response.ok){
    //             setStatus('error')
    //             setMessage(responseBody.message)
    //         }

    //         if (response.ok){
    //             setStatus('success')
    //             setMessage('Se actualizó tu contraseña, puedes volver a intentar iniciar sesión')
    //         }
    //     } catch (error: unknown) {
    //         let message = "Error desconocido";
    //         if (error instanceof Error) message = error.message;
    //         setStatus('error')
    //         setMessage(`${message}`||'Ocurrió un problema.')
    //         setStatus('error')
    //     }
    // }

    // if(status=== 'success'){
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8 text-center">
    //             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
    //             <CheckCircle className="w-10 h-10 text-success" />
    //             </div>
                
    //             <h1 className="text-2xl font-semibold mb-2 text-success">¡Cuenta recuperada correctamente!</h1>
                
    //             <p className="text-gray-3 mt-4 max-w-md mb-8 font-inter">
    //             Se actualizó tu contraseña, puedes volver a intentar iniciar sesión
    //             </p>
    //             <div className="flex gap-2">
    //             <Button 
    //             variant="outline"
    //             onClick={goToLogin}
    //             >
    //                 Volver
    //             </Button>
    //             </div>
    //         </div>
    //     )
    // }


    // if(status === 'error' && !token){
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8 text-center">
    //             <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
    //                 <XCircle className="w-10 h-10 text-error" />
    //             </div>
    //             <h1 className="text-2xl font-semibold mb-2 text-error">
    //                 Error
    //             </h1>
    //             <p className="text-gray-3 mt-4 max-w-md mb-8 font-inter">
    //                 {message}
    //             </p>
    //             <Button variant="outline" onClick={() => router.push("/login")}>
    //                 Volver al inicio
    //             </Button>
    //         </div>
    //     );
    // }

    // return(
    //     <div className="flex flex-col items-center justify-center min-h-screen py-6 px-8">
            
    //         <div className="flex flex-col items-center text-center w-full max-w-md">
    //             <div className="flex flex-col w-full justify-start mb-4 space-y-2">
    //                 <Link href="/login" className="flex items-center text-sm hover:text-gray-3">
    //                     <ChevronLeft className="w-4 h-4 mr-1" />
    //                     Volver
    //                 </Link>
    //                 <Image
    //                     src="/isologo.webp"
    //                     alt="Logo de Carpool"
    //                     width={50}
    //                     height={50}
    //                     className="mb-4"
    //                 />
    //             </div>
    //             {/* Icono principal con animación sutil */}
    //             <div className="w-20 h-20 bg-gray-1/90 rounded-full flex items-center justify-center mb-4">
    //                 <LockKeyhole className="w-10 h-10 text-primary" />
    //             </div>

    //             <h1 className="text-2xl font-semibold mb-2">Recuperá tu cuenta</h1>
                
    //             <form onSubmit={passwordsForm.handleSubmit(handleSubmit)}>
    //                 <div className="flex flex-col text-start gap-4">
                        
    //                     <div className="w-80">
    //                         <Input
    //                             label="Nueva Contraseña"  
    //                             type="password"
    //                             {...passwordsForm.register('password')}
    //                             error={passwordsForm.formState.errors.password?.message}
                                
    //                             />
    //                     </div>

    //                     <div>
    //                         <Input
    //                             label="Confirmar nueva contraseña"  
    //                             type="password"
    //                             {...passwordsForm.register('confirmPassword')}
    //                             error={passwordsForm.formState.errors.confirmPassword?.message}
    //                             />
    //                     </div>
                        
    //                     <Button
    //                     type="submit"
    //                     variant="primary"
    //                     disabled={!passwordsForm.formState.isValid}>
    //                     Confirmar
    //                     </Button>
    //                 </div>
    //             </form>

    //             {(status === 'error') && (
    //                 <div
    //                     className="fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white 
    //                     bg-error"
    //                 >
    //                     <XCircle className="w-5 h-5" />
    //                     <span>{message}</span>
    //                 </div>
    //             )}
    //         </div>
    //     </div>
    //)
}