'use client'
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="md:min-h-screen flex flex-col md:flex-row">
      {/* Columna izquierda: Imagen + slogan + fondo */}
      <div className="hidden md:flex fixed inset-y-0 left-0 w-2/5 bg-gradient-to-b from-dark-4 via-dark-3 to-dark-2 px-[156px] py-12 items-center justify-center z-10">
        <div className="flex flex-col items-center text-center w-[200px]">
          <Image
            src="/carpool-wslogan.png"
            alt="Imagen de login"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
          <h1 className="font-outfit font-regular mt-4 text-lg text-white">
            Un viaje compartido, un destino en común.
          </h1>
        </div>
      </div>

      <div className="flex justify-center w-full md:hidden">
        <Image
          src="/logo-carpool.svg"  // el nuevo logo que querés mostrar
          alt="Logo mobile"
          width={200}
          height={0}
          priority
          className="h-auto dark:invert"
        />
      </div>

      <div className="w-full md:ml-[40%] md:w-3/5 flex flex-col items-center justify-center md:px-[156px] md:py-12 min-h-screen">
        <div>
          <div className="mb-6 flex justify-center">
            <Image
              src="/home.svg"
              alt="Logo"
              width={600}
              height={0}
              priority
              className="h-auto"
            />
          </div>

          <div className="w-full flex flex-col md:flex-row justify-center items-center mt-20 gap-6">
            <Button 
              variant="outline" 
              className="py-3 text-lg w-full"
              onClick={() => router.push("/register")} 
              >Registrarse
            </Button>

            <Button 
              variant="secondary" 
              className="py-3 text-lg w-full"
              onClick={() => router.push("/login")}
            >Iniciar sesión
            </Button>
          </div>
          
          
        </div>
        
      </div>
      
    </div>
  );
}
