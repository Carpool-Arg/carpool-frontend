import { Card, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";


interface SavedCO2Props{
  totalSaved: number;
  loading:boolean;
}

export default function SavedCO2({totalSaved, loading}:SavedCO2Props) {
  return(
    <Card className='bg-gray-8 border-gray-2/50 rounded-3xl shadow-2xl'>
      <CardContent className='px-8 py-4'>
        <div className='flex items-center gap-2 text-success/85 mb-3'>
          <Leaf size={20} />
          <span className='text-sm uppercase tracking-[0.2em] text-gray-11'>Impacto Ambiental</span>
        </div>
        <h1 className='text-3xl md:text-4xl font-semibold tracking-tight text-white'>
          {(totalSaved).toFixed(2)} kg
        </h1>
        <p className='text-gray-11 mt-2 text-sm'>Total estimado CO₂ ahorrado por compartir viajes.</p>
      </CardContent>
    </Card>
  )
}