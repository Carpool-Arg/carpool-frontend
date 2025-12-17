"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATE } from "@/constants/state";
import { BrushCleaning, Circle, Minus } from "lucide-react";
import { BsHandbag } from "react-icons/bs";

export interface FilterBarProps{
  nameState: string | undefined;
  setNameState: (v: string | undefined) => void;
  hasBaggage: boolean | undefined;
  setHasBaggage: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function FilterBar({nameState, setNameState, hasBaggage, setHasBaggage}:FilterBarProps) {
 
  const toggleHasBaggage = () => {
    setHasBaggage((prev: boolean | undefined) => {
      if(prev === undefined) return true;
      if(prev === true) return false;
      return undefined;
    })
  }

  const handleClearFilters = () => {
    setHasBaggage(undefined)
    setNameState('PENDING')
  }

  const hasFilters = nameState !== 'PENDING' || hasBaggage !== undefined

  return(
    <div className="flex flex-wrap gap-2 mb-2">
      <button
        className={`flex items-center gap-2 px-3 py-1 text-sm border rounded-lg border-gray-2 hover:bg-gray-2 transition ${
          hasBaggage === true ? "border-gray-6 bg-gray-8" : hasBaggage === false ? "border-gray-6 bg-gray-8" : ""
        }`}
        onClick={toggleHasBaggage}
      > 
        <BsHandbag />
        <span>Equipaje</span>
        {hasBaggage === true ? <Circle size={6} fill="currentColor"/> : hasBaggage === false ? <Minus size={10}/> : ""}
      </button>

      <div>
        <Select
          value={nameState}
          onValueChange={(value)  =>  setNameState(value)}
        >
          <SelectTrigger
            id="status"
            className="w-full font-outfit dark:bg-dark-5"
          >
            <SelectValue placeholder="Seleccioná estado" />
          </SelectTrigger>

          <SelectContent>
            {STATE
              .filter((s) => s.scope === "RESERVATION")
              .map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {hasFilters && (
        <button
          className="flex items-center gap-1 px-3 py-1 text-sm  rounded-xl bg-gray-2 transition"
          onClick={handleClearFilters}
          >
          <span><BrushCleaning size={14}/></span>
          Limpiar filtros
          
        </button>
      )}
      
    </div>
  );
}