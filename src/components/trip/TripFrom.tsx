'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TripFormData, tripSchema } from '@/schemas/trip/tripSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { CalendarPlus, Clock } from 'lucide-react';
import { useUserVehicles } from '@/hooks/useUserVehicles';
import { VehicleSelector } from './VehicleSelector';


export function TripForm() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      date: '',
      time: '',
      originTown: '',
      destinationTown: '',
      intermediateTown: '',
      availableSeat: 1,
      availableBaggage: '',
      seatPrice: 0,
      idVehicle: 0
    }
  });

  const {vehicles} = useUserVehicles();

  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const onSubmit = (data: TripFormData) => {
    const startDateTime = new Date(`${data.date}T${data.time}`).toISOString();
    console.log({ ...data, startDateTime });
    // Aquí llamarías a tu API para crear el viaje
  };

  const selectedVehicleId = watch('idVehicle');
  const availableSeat = watch('availableSeat');

  useEffect(() => {
    if (!selectedVehicleId) return;
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (!vehicle) return;

    // Solo actualizar el input si el usuario no lo modificó manualmente
    if (availableSeat === 1 || availableSeat !== vehicle.availableSeats) {
      setValue('availableSeat', vehicle.availableSeats);
    }
  }, [selectedVehicleId, vehicles]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">

      {/* Origen y Destino */}
      <Input
        label="Ciudad de origen"
        type="text"
        {...register('originTown', { required: 'La ciudad de origen es obligatoria' })}
        error={errors.originTown?.message}
      />

      <Input
        label="Ciudad de destino"
        type="text"
        {...register('destinationTown', { required: 'La ciudad de destino es obligatoria' })}
        error={errors.destinationTown?.message}
      />

      {/* Botones de Fecha y Hora */}
      <div className="flex gap-4">
        <div>
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white"
            onClick={() => dateRef.current?.showPicker()}
          >
            <CalendarPlus className="w-6 h-6" />
          </button>
          <input
            type="date"
            {...register('date', { required: 'La fecha es obligatoria' })}
            ref={dateRef}
            className="hidden"
            onChange={(e) => setValue('date', e.target.value)}
          />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
          {selectedDate && <p className="text-xs mt-1 text-gray-300">{selectedDate}</p>}
        </div>

        <div>
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 text-white"
            onClick={() => timeRef.current?.showPicker()}
          >
            <Clock className="w-6 h-6" />
          </button>
          <input
            type="time"
            {...register('time', { required: 'La hora es obligatoria' })}
            ref={timeRef}
            className="hidden"
            onChange={(e) => setValue('time', e.target.value)}
          />
          {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>}
          {selectedTime && <p className="text-xs mt-1 text-gray-300">{selectedTime}</p>}
        </div>
      </div>

      <VehicleSelector
        selectedVehicle={vehicles.find(v => v.id === watch('idVehicle'))}
        onSelect={(vehicle) => setValue('idVehicle', vehicle.id)}
      />

      <Input
        label="Asientos disponibles"
        type="number"
        min={1}
        {...register('availableSeat', { required: 'Debe indicar la cantidad de asientos', valueAsNumber: true })}
        error={errors.availableSeat?.message}
      />

      <Button type="submit" variant="primary">
        Crear viaje
      </Button>
    </form>
  );
}
