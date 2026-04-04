import { ShieldAlert } from "lucide-react";


export default function InvalidDriverAlert() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
        <ShieldAlert size={22} className="text-amber-400" />
      </div>

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-lg font-medium text-white/90">
          Tu licencia no está habilitada
        </h3>
        <p className="text-sm text-white/50 leading-relaxed">
          Para publicar un viaje necesitás tener una licencia válida y aprobada.
          Si creés que es un error, contactate con nuestro equipo de soporte.
        </p>
      </div>
    </div>
  );
}