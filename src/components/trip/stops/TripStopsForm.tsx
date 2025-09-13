'use client'

import { CityAutocomplete } from "@/components/city/CityAutocomplete"
import { TripStopFormData, tripStopSchema } from "@/schemas/trip/tripStopSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { closestCorners, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core"
import { useState } from "react"
import { title } from "process"
import { Column } from "./Column"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { TripStopProps } from "./TripStop"
import { City } from "@/types/city"
import { TripStop } from "@/types/tripStop"
import { Button } from "@/components/ui/Button"

export function TripStopForm(){

    const [tripStopsList, setTripStopsList] = useState<TripStopProps[]>([])
    const [tripStops, setTripStops] = useState<TripStop[]>([])
    
    const{
        register,
        handleSubmit, 
        control,
        getValues,
        formState: {errors, isValid},
        setValue,
        watch
    } = useForm<TripStopFormData>({
        resolver: zodResolver(tripStopSchema),
        mode: 'onChange',
        defaultValues:{
            cityId: 0,
            observation:''
        }
    })

    const [city, setCity] = useState<City>()

    const onSubmit = () =>{
        const tripStops: TripStop[] = tripStopsList.map((stop, index) => ({
        cityId: stop.cityId,
        order: index + 1,           // order empieza en 1 según el índice
        start: false,               // todos en false
        destination: false,         // todos en false
        observation: stop.observation
        }));

        setTripStops(tripStops);
        console.log(tripStops)
    } 

    const addTripStop = (title:string,cityId:number,observation:string) =>{
        setTripStopsList((tripStopsList) => [...tripStopsList, {id: tripStopsList.length + 1,title,cityId,observation}])
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

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor,{
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )


    return(
        <div className="flex flex-col justify-between h-full items-center">
            <div className="flex flex-col justify-center items-center">
                <h2 className="text-xl text-center font-medium mb-16 ">
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
                            field.onChange(city.id)
                            setCity({id:city.id,name:city.name})
                        }}
                        error={errors.cityId?.message}
                        label='Ingrese la localidad intermedia'
                        placeholder='Seleccione la localidad'
                        />
                    )}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2">Ingrese una observación</label>
                    <textarea
                        {...register('observation', {required: 'La observación es obligatoria.'})}
                        rows={4}
                        placeholder="Observación..."
                        className="w-full p-2 rounded border border-gray-5 dark:border-gray-2 resize-none"
                    />
                </div>

                <div>
                    <button className="bg-gray-2 rounded-full p-2"
                    onClick={()=>{
                        addTripStop(city?.name ?? '', city?.id ?? 0,getValues('observation'))
                    }}>
                        <Plus size={18}/>
                    </button>
                </div>

                <div className="flex flex-col items-center mt-2.5 gap-12.5 h-full w-full">
                    <h1>Paradas intermedias</h1>
                    <DndContext  sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}
                    >
                        <Column tripStops={tripStopsList}/>
                    </DndContext>
                </div>

                <div className="flex justify-center gap-7.5 mt-8">
                <Button 
                    type="button" 
                    variant="outline" 
                    
                    className='px-15 py-2 text-sm font-inter font-medium'
                >
                    Atrás
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={onSubmit}
                    className='px-12 py-2 text-sm font-inter font-medium'
                >
                    Siguiente
                </Button>
                </div>
            </div>
        </div>
    )
}
