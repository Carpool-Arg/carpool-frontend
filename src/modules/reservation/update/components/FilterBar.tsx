"use client"

import { Circle, ListFilter, Minus } from "lucide-react";
import { BsHandbag } from "react-icons/bs";

export interface FilterBarProps {
  hasBaggage: boolean | undefined;
  // CAMBIO 1: Definimos la función simple, ya no es un Dispatch de React
  setHasBaggage: (value: boolean | undefined) => void;
}

export default function FilterBar({ hasBaggage, setHasBaggage }: FilterBarProps) {
 
  const toggleHasBaggage = () => {
    // CAMBIO 2: Usamos la prop 'hasBaggage' actual para decidir el siguiente valor.
    // Ciclo: undefined (Todos) -> true (Con equipaje) -> false (Sin equipaje) -> undefined
    if (hasBaggage === undefined) {
      setHasBaggage(true);
    } else if (hasBaggage === true) {
      setHasBaggage(false);
    } else {
      setHasBaggage(undefined);
    }
  }

  return(
    <div className="flex items-center gap-2 mb-2">
      <div className="flex items-center gap-2 text-sm px-3 py-0.5 rounded-md bg-gray-8">
        <ListFilter size={14}/>
        <p>Filtros</p>
      </div>
      
      <button
        className={`flex items-center gap-2 px-3 py-0.5 text-sm border rounded-md border-gray-2 hover:bg-gray-2 transition ${
          hasBaggage === true ? "border-gray-6 bg-gray-8" : hasBaggage === false ? "border-gray-6 bg-gray-8" : ""
        }`}
        onClick={toggleHasBaggage}
      > 
        <BsHandbag />
        <span>Equipaje</span>
        {/* Renderizado condicional de iconos */}
        {hasBaggage === true ? <Circle size={6} fill="currentColor"/> : hasBaggage === false ? <Minus size={10}/> : ""}
      </button>

      {}
    </div>
  );
}