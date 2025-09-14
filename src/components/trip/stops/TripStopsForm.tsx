'use client'

import { CityAutocomplete } from "@/components/city/CityAutocomplete"
import { TripStopFormData, tripStopSchema } from "@/schemas/trip/tripStopSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleSmall, Plus, XCircle } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core"
import { useEffect, useState } from "react"
import { title } from "process"
import { Column } from "./Column"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { TripStopProps } from "./TripStop"
import { City } from "@/types/city"
import { TripStop } from "@/types/tripStop"
import { Button } from "@/components/ui/Button"
import { Toast } from "@/components/ui/Toast"


type TripStopFormProps = {
  onSubmitTripStops: (tripStops: TripStop[]) => void
}

export function TripStopForm({ onSubmitTripStops }: TripStopFormProps){

    const [tripStopsList, setTripStopsList] = useState<TripStopProps[]>([])
     const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null)

    const{
        register,
        handleSubmit, 
        control,
        getValues,
        formState: {errors, isValid},
        setValue,
        watch,
        trigger
    } = useForm<TripStopFormData>({
        resolver: zodResolver(tripStopSchema),
        mode: 'onChange',
        defaultValues:{
            cityId: 0,
            observation:''
        }
    })

    const [city, setCity] = useState<City>()



    const onSubmit = async() =>{
        const tripStops: TripStop[] = tripStopsList.map((stop, index) => ({
        cityId: stop.cityId,
        order: index + 1,           
        start: false,               
        destination: false,         
        observation: stop.observation
        }));

        onSubmitTripStops(tripStops)
    } 

    

    const addTripStop =async (title:string,cityId:number,observation:string) =>{
        const valid = await  trigger(['cityId', 'observation'])
        if (!valid) return

        const exists = tripStopsList.some((stop) => stop.cityId === cityId)
        if(exists){
            setToast({ message: 'Ya agregaste esta ciudad', type: 'error' })
            return 
        }
        setTripStopsList((tripStopsList) => [...tripStopsList, {id: tripStopsList.length + 1,title,cityId,observation}])
        setValue('observation', '')
        setValue('cityId', 0)
        setCity(undefined)
    }
    const getTripStopsPos = (id:UniqueIdentifier) => tripStopsList.findIndex(tripStop => 
        tripStop.id === id
    )

    const handleDragEnd = (event:DragEndEvent) => {
        const {active, over} = event

        if (!over) return
        if(active.id === over.id) return;

        setTripStopsList(tripStopsList =>{
            const originalPos = getTripStopsPos(active.id)
            const newPos = getTripStopsPos(over.id)

            return arrayMove(tripStopsList,originalPos,newPos)
        })
    }

    //Esto me daba error si lo hacia con el id del objeto, no se porque habia mas de uno con el mismo id
    const handleDeleteTripStop = (cityId: number) => {
        setTripStopsList((prev) => prev.filter((stop) => stop.cityId !== cityId));
    };


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor,{
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )


    return(
        <form className="flex flex-col justify-start gap-4 h-full w-full max-w-md mx-auto md:py-8"
            onSubmit={handleSubmit(onSubmit)}>

            <div className="flex flex-col justify-center items-center">
                <h2 className="text-2xl text-center font-medium mb-10.5">
                    Ingresá tus paradas intermedias
                </h2>
                <div className="md:col-span-2">
                    <Controller
                    name="cityId"
                    control={control}
                    render={({ field }) => (
                        <CityAutocomplete
                        value={field.value}
                        onChange={ (city) => {
                            field.onChange(city?.id)
                            setCity({id: city ? city.id : 0,name: city ?  city?.name : ''})
                        }}
                        error={errors.cityId?.message}
                        label='Ingrese la localidad intermedia'
                        placeholder='Seleccione la localidad'
                        icon={<CircleSmall size={18} />}
                        />
                    )}
                    />
                </div>

                <div className="md:col-span-2 mt-2">
                    <label className="text-sm font-medium font-inter">Ingrese una observación</label>
                    <textarea
                        {...register('observation', {required: 'La observación es obligatoria.'})}
                        rows={4}
                        placeholder="Observación..."
                        className="w-full p-2 mt-2 rounded border border-gray-5 dark:border-gray-2 resize-none"
                    />
                    {errors.observation && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.observation.message}
                        </p>
                    )}
                </div>

                <div className="w-full flex justify-end mt-4.5">
                    <button type="button" className="bg-gray-2 rounded-full p-3"
                        onClick={() => addTripStop(city?.name ?? "", city?.id ?? 0, getValues("observation"))}
                    >
                        <Plus size={18}/>
                    </button>
                </div>

                <div className="flex flex-col items-start mt-2.5 h-full w-full">
                    <h1 className="mb-5">Paradas</h1>
                    <DndContext  sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}
                    >
                        <Column tripStops={tripStopsList} onDelete={handleDeleteTripStop}/>
                    </DndContext>
                </div>

                <div className="flex justify-center gap-7.5 mt-8">
                    <Button 
                        type="submit" 
                        variant="outline" 
                        className='px-15 py-2 text-sm font-inter font-medium'
                    >
                        Atrás
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        disabled={tripStopsList.length === 0}
                        className='px-12 py-2 text-sm font-inter font-medium'
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
        </form>
    )
}
