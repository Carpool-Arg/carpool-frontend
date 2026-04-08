'use client'

import { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { ChevronDown, User, UserPen } from "lucide-react";
import { translateGender } from "@/shared/utils/gender";
import { useRouter } from "next/navigation";

export default function UserDetails() {
  const { user } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="max-w-lg">
      <div className="rounded-xl border border-gray-7 overflow-hidden">

        {/* Header (clickable) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full cursor-pointer flex items-center justify-between px-5 py-3.5 bg-gray-8 hover:bg-gray-7/70 transition-colors"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm text-gray-11">
              Datos de usuario
            </span>
            <span className="text-sm font-medium text-white">
              @{user.username}
            </span>
          </div>

          <ChevronDown
            size={18}
            className={`text-gray-11 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Content */}
        {isOpen && (
          <div className="flex flex-col p-5 border-t border-gray-7 animate-in fade-in duration-200">

            {/* fila 1 */}
            <div className="grid grid-cols-2 gap-4 pb-3">
              <div>
                <p className="text-gray-11 text-sm">Nombre</p>
                <p className="text-white font-medium">{user.name}</p>
              </div>

              <div>
                <p className="text-gray-11 text-sm">Apellido</p>
                <p className="text-white font-medium">{user.lastname}</p>
              </div>
            </div>

            {/* fila 2 */}
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-7">
              <div>
                <p className="text-gray-11 text-sm">DNI</p>
                <p className="text-white font-medium">{user.dni}</p>
              </div>

              <div>
                <p className="text-gray-11 text-sm">Fecha de nacimiento</p>
                <p className="text-white font-medium">{user.birthDate}</p>
              </div>
            </div>

            {/* fila 3 */}
            <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-7">
              <div>
                <p className="text-gray-11 text-sm">Correo</p>
                <p className="text-white font-medium truncate">{user.email}</p>
              </div>

              <div>
                <p className="text-gray-11 text-sm">Celular</p>
                <p className="text-white font-medium">{user.phone}</p>
              </div>
            </div>

            {/* fila 4 */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-7">
              <div>
                <p className="text-gray-11 text-sm">Género</p>
                <p className="text-white font-medium">{translateGender(user.gender)}</p>
              </div>

              <button 
                onClick={()=>router.push('/profile/details')}
                className="bg-gray-9/20 hover:bg-gray-9/30 cursor-pointer rounded-lg py-2 flex items-center justify-center gap-2 text-sm"
              >
                <UserPen size={16}/>
                Editar datos
              </button>
              <div />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}