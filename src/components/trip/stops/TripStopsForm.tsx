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

export function TripStopForm(){

    const [tripStops, setTripStops] = useState([
        {id:1, title: "Localidad Intermedia 1"},
        {id:2, title: "Localidad Intermedia 2"},
        {id:3, title: "Localidad Intermedia 3"},
    ])
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

    const [cityName, setCityname] = useState("")


    const addTripStop = (title:string) =>{
        setTripStops((tripStops) => [...tripStops, {id: tripStops.length + 1,title}])
    }
    const getTripStopsPos = (id:UniqueIdentifier) => tripStops.findIndex(tripStop => 
        tripStop.id === id
    )

    const handleDragEnd = (event:DragEndEvent) => {
        const {active, over} = event

        if (!over) return
        if(active.id === over.id) return;

        setTripStops(tripStops =>{
            const originalPos = getTripStopsPos(active.id)
            const newPos = getTripStopsPos(over.id)

            return arrayMove(tripStops,originalPos,newPos)
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
                            setCityname(city.name)
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
                        addTripStop(cityName)
                    }}>
                        <Plus size={18}/>
                    </button>
                </div>

                <div className="flex flex-col items-center mt-2.5 gap-12.5 h-full w-full">
                    <h1>Paradas intermedias</h1>
                    <DndContext  sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}
                    >
                        <Column tripStops={tripStops}/>
                    </DndContext>
                </div>
            </div>
        </div>
    )
}
