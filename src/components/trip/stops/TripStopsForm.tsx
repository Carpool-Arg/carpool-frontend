'use client'

import { CityAutocomplete } from "@/components/city/CityAutocomplete"
import { Button } from "@/components/ui/Button"
import { Toast } from "@/components/ui/Toast"
import { TripStopFormData, tripStopSchema } from "@/schemas/trip/tripStopSchema"
import { City } from "@/types/city"
import { TripStop, TripStopExtended } from "@/types/tripStop"
import { closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleSmall, Plus } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { TripStopList } from "./TripStopList"
import { TripStopProps } from "./TripStop"


type TripStopFormProps = {
  initialStops?: TripStop[];
  onSubmitTripStops: (tripStops: TripStopExtended[]) => void; 
  onNext: () => void;     
  onBack: () => void;    
};

export function TripStopForm({ initialStops=[],onSubmitTripStops, onBack, onNext }: TripStopFormProps){
    const [tripStopsList, setTripStopsList] = useState<TripStopProps[]>(
    initialStops.map((stop, index) => ({
      id: index + 1, // le damos un id para DnD
      title: stop.cityName ?? '',      // podés poner stop.observation o alguna otra info si querés
      cityId: stop.cityId,
      observation: stop.observation,
    }))
  );
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null)
    const [observation, setObservation] = useState('')
    const [city, setCity] = useState<City>()


    const addTripStop = (title:string, cityId:number, observation:string) => {
        if (!cityId) {
            setToast({ message: 'Seleccioná una ciudad', type: 'error' })
            return
        }
        if (!observation.trim()) {
            setToast({ message: 'Ingresá una observación', type: 'error' })
            return
        }
        const exists = tripStopsList.some(stop => stop.cityId === cityId)
        if (exists) {
            setToast({ message: 'Ya agregaste esta ciudad', type: 'error' })
            return
        }

        setTripStopsList(prev => [...prev, { id: prev.length + 1, title, cityId, observation }])
        setCity(undefined)
        setObservation('')
    }

    const getTripStopsPos = (id: UniqueIdentifier) => tripStopsList.findIndex(tripStop => tripStop.id === id)

    const handleDragEnd = (event:DragEndEvent) => {
        const {active, over} = event

        if (!over || active.id === over.id) return

        setTripStopsList(tripStopsList =>{
            const originalPos = getTripStopsPos(active.id)
            const newPos = getTripStopsPos(over.id)
            return arrayMove(tripStopsList,originalPos,newPos)
        })
    }

    //Esto me daba error si lo hacia con el id del objeto, no se porque habia mas de uno con el mismo id
    const handleDeleteTripStop = (cityId: number) => {
        setTripStopsList(prev => prev.filter(stop => stop.cityId !== cityId))
    }


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor,{
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    
    return(
        <div className="flex flex-col justify-start gap-4 h-full w-full max-w-md mx-auto">
            <div className="flex flex-col justify-center  w-full">
                <h2 className="text-2xl text-center font-medium mb-10.5">
                    Ingresá tus paradas intermedias
                </h2>
                <div className="md:col-span-2">
                    <CityAutocomplete
                        value={city?.id ?? 0}
                        onChange={c => setCity(c ? { id: c.id, name: c.name } : undefined)}
                        label='Ingrese la localidad intermedia'
                        placeholder='Seleccione la localidad'
                        icon={<CircleSmall size={18} />}
                    />
                </div>

                <div className="md:col-span-2 mt-2 w-full">
                    <label className="text-sm font-medium font-inter">Ingrese una observación</label>
                    <textarea
                        rows={4}
                        placeholder="Observación..."
                        value={observation}
                        onChange={e => setObservation(e.target.value)}
                        className="w-full p-2 mt-2 rounded border border-gray-5 dark:border-gray-2 resize-none"
                    />
                </div>

                <div className="w-full flex justify-end mt-4.5">
                    <button type="button" className="bg-gray-2 rounded-full p-3"
                        onClick={() => addTripStop(city?.name ?? "", city?.id ?? 0, observation)}
                    >
                        <Plus size={18}/>
                    </button>
                </div>

                <div className="flex flex-col items-start mt-2.5 h-full w-full">
                    <h1 className="mb-5">Paradas</h1>
                    <DndContext  sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}
                    >
                        <TripStopList tripStops={tripStopsList} onDelete={handleDeleteTripStop}/>
                    </DndContext>
                </div>

                <div className="flex justify-center gap-7.5 my-8">
                    <Button 
                        variant="outline" 
                        className='px-15 py-2 text-sm font-inter font-medium'
                        onClick={onBack}
                    >
                        Atrás
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        className='px-12 py-2 text-sm font-inter font-medium'
                        onClick={() => {
                            onSubmitTripStops(tripStopsList.map((stop, index) => ({
                              ...stop,
                              order: index + 1,
                              start: false,
                              destination: false,
                              cityName: stop.title
                            })));
                            onNext();
                        }}
                    >
                        Siguiente
                    </Button>

                </div>
            </div>
            {toast && (
                <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
                />
            )}
        </div>
    )
}
