import React from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TripStop, TripStopProps } from './TripStop';




interface ColumnProps{
    tripStops: TripStopProps[];
}


export const Column = ({ tripStops} :ColumnProps) => {
  return (
    <div className='bg-gray-5 rounded-lg p-3.5 w-2/3 max-w-lg flex flex-col gap-3.5'>
        <SortableContext items={tripStops} strategy=
        {verticalListSortingStrategy}>
        {tripStops.map((tripStop) => 
            <TripStop id={tripStop.id} title={tripStop.title} cityId={tripStop.cityId} observation={tripStop.observation} key = {tripStop.id}/>
        )}
        </SortableContext>
    </div>
  )
}
