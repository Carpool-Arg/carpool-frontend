import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export interface TripStopProps{
    id:number,
    title: string
    cityId: number
    observation: string
}

export const TripStop = ({id,title}: TripStopProps) => {
    const {attributes, listeners, setNodeRef, transform,transition} = useSortable({id});

    const style  = {
        transition,
        transform: CSS.Transform.toString(transform)
    }
    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style = {style} className='bg-gray-5 rounded-md shadow-lg w-full p-5 flex items-center justify-start gap-5 touch-none'>{title}</div>
    )
}
