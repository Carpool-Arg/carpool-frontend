import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TripStop } from './TripStop';


export interface TripStop{
    title: string,
    id: number
}

interface ColumnProps{
    tripStops: TripStop[];
}


export const Column = ({ tripStops} :ColumnProps) => {
  return (
    <div className='bg-gray-5 rounded-lg p-3.5 w-2/3 max-w-lg flex flex-col gap-3.5'>
        <SortableContext items={tripStops} strategy=
        {verticalListSortingStrategy}>
        {tripStops.map((tripStop) => 
            <TripStop id={tripStop.id} title={tripStop.title} key = {tripStop.id}/>
        )}
        </SortableContext>
    </div>
  )
}
