import { DriverForm } from "@/components/driver/DriverForm";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterDriverPage() {


  return (
    <main className="p-8 flex justify-center h-screen">
        <div className="flex flex-col items-start w-full max-w-lg space-y-6">
          <Link href="/profile" className="flex items-center text-sm hover:text-gray-3 mb-4 w-fit">
            <ChevronLeft  className="w-4 h-4 mr-1" />
            Volver
          </Link>

          <div className="flex flex-col items-start w-full space-y-2">
            <Image
              src="/isologo.webp"
              alt="Logo de Carpool"
              width={50}
              height={50}
              className="mb-4"
            />
            <h1 className="text-lg font-semibold">Completa tu perfil de conductor</h1>
            <p className="text-sm text-muted-foreground">
              Estás a un paso de registrarte como conductor. Ingresá los siguientes datos personales para finalizar.
            </p>
          </div>
          <DriverForm/>
        </div>
    </main>

  );
}
