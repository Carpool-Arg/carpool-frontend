"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATE } from "@/constants/state";
import { BrushCleaning, Circle, Minus } from "lucide-react";
import { BsHandbag } from "react-icons/bs";

export interface FilterBarProps{
  hasBaggage: boolean | undefined;
  setHasBaggage: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export default function FilterBar({ hasBaggage, setHasBaggage}:FilterBarProps) {
 
  const toggleHasBaggage = () => {
    setHasBaggage((prev: boolean | undefined) => {
      if(prev === undefined) return true;
      if(prev === true) return false;
      return undefined;
    })
  }

  return(
    <div className="flex flex-wrap gap-2 mb-2">
      <button
        className={`flex items-center gap-2 px-3 py-0.5 text-sm border rounded-lg border-gray-2 hover:bg-gray-2 transition ${
          hasBaggage === true ? "border-gray-6 bg-gray-8" : hasBaggage === false ? "border-gray-6 bg-gray-8" : ""
        }`}
        onClick={toggleHasBaggage}
      > 
        <BsHandbag />
        <span>Equipaje</span>
        {hasBaggage === true ? <Circle size={6} fill="currentColor"/> : hasBaggage === false ? <Minus size={10}/> : ""}
      </button>
    </div>
  );
}