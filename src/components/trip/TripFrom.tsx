'use client';

import { useState, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TripFormData, TripRequest, tripSchema } from '@/schemas/trip/tripSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Backpack, CalendarPlus, Clock, X } from 'lucide-react';
import { useUserVehicles } from '@/hooks/useUserVehicles';
import { VehicleSelector } from './VehicleSelector';
import Image from 'next/image';
import { Briefcase, ShoppingBag } from "lucide-react";
import { BsBackpack, BsSuitcase } from 'react-icons/bs';
import { RiHandbagLine } from 'react-icons/ri';
import { BiBriefcaseAlt } from 'react-icons/bi';
import { newTrip } from '@/services/tripService';
import { useRouter } from 'next/navigation';
import { CityAutocomplete } from '../city/CityAutocomplete';

const baggageOptions = [
  {
    type: "LIVIANO",
    icon: BsBackpack,
  },
  {
    type: "MEDIANO",
    icon: BiBriefcaseAlt,
  },
  {
    type: "PESADO",
    icon: BsSuitcase,
  },
  {
    type: "NO_EQUIPAJE",
    icon: X,
  },
];

export function TripForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string>('');
  const router = useRouter()

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      startDateTime: '',
      originCityId: 0,
      destinationCityId: 0,
      intermediateCity: '',
      availableSeat: 1,
      availableBaggage: '',
      seatPrice: 0,
      idVehicle: 0
    }
  });

  const { vehicles, loading: vehiclesLoading, error: vehiclesError } = useUserVehicles();


  const selectedVehicleId = watch('idVehicle');
  const availableBaggage = watch('availableBaggage');

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  useEffect(() => {
    if (selectedVehicle) {
      setValue('availableSeat', selectedVehicle.availableSeats);
    }
  }, [selectedVehicle, setValue]);

  const onSubmit = async (data: TripFormData) => {
    try {
      const response = await newTrip(data)

      if (response.state === "ERROR") {
        setError(response.messages?.[0] || "Error al guardar el vehículo");
        return;
      }

      router.push('/profile')
    } catch (error) {
      setError("Error al crear el viaje");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
      
      {step === 1 && (
        // === PASO 1: Seleccionar vehículo ===
        <div>
          <h2 className="text-lg font-medium mb-3">Seleccioná el vehículo</h2>

          {vehiclesError && <p className="text-sm text-red-500">{vehiclesError}</p>}

          <VehicleSelector
            selectedVehicle={selectedVehicle}
            onSelect={(vehicle) => setValue('idVehicle', vehicle.id)}
          />

          <div className="flex gap-2 mt-4">
            <Button type="button" variant="secondary">Cancelar</Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(2)}
              disabled={!selectedVehicleId}
            >
              Continuar
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        // === PASO 2: Seleccionar equipaje ===
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium">Crear viaje</h2>
            <button
              type="button"
              className="text-sm text-gray-400 underline"
              onClick={() => setStep(1)}
            >
              Cambiar vehículo
            </button>
          </div>

          {selectedVehicle && (
            <div className='flex items-center p-3 mb-3 border rounded border-gray-5/75 bg-dark-3 gap-4'>
              <div className="w-10 h-10 relative flex-shrink-0">
                <Image
                  src={`/${selectedVehicle.vehicleTypeName}.png`}
                  alt="Car logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedVehicle.brand} {selectedVehicle.model}</p>
                <p className="text-xs text-gray-1">Patente {selectedVehicle.domain}</p>
                <p className="text-xs text-gray-1">Asientos totales {selectedVehicle.availableSeats}</p>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <Controller
              name="originCityId"
              control={control}
              render={({ field }) => (
                <CityAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.originCityId?.message}
                  label='Desde'
                />
              )}
            />
          </div>
          <div className="md:col-span-2">
            <Controller
              name="destinationCityId"
              control={control}
              render={({ field }) => (
                <CityAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.destinationCityId?.message}
                  label='Hasta'
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Fecha y hora de salida</label>
            <input
              type="datetime-local"
              {...register('startDateTime', { required: 'La fecha y hora son obligatorias' })}
              className="w-full p-2 rounded border border-gray-300 bg-dark-3 text-white"
            />
            {errors.startDateTime && (
              <p className="text-xs text-red-500 mt-1">{errors.startDateTime.message}</p>
            )}
          </div>


          <Input
            label="Asientos disponibles"
            type="number"
            min={1}
            {...register('availableSeat', { required: 'Debe indicar la cantidad de asientos', valueAsNumber: true })}
            error={errors.availableSeat?.message}
          />

          <Input
            label="Precio por asiento"
            type="number"
            min={1}
            {...register('seatPrice', { required: 'Debe indicar el precio por asiento', valueAsNumber: true })}
            error={errors.seatPrice?.message}
          />

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(2)}>
              Atrás
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(3)}
            >
              Continuar
            </Button>
          </div>
        </div>
        
      )}

      {step === 3 && (
        // === PASO 3: Completar resto del form ===
        <div className='flex flex-col justify-center'>
          <h2 className="text-lg font-medium mb-3 ">
            Seleccioná el equipaje
          </h2>

          <div className="grid grid-cols-2 justify-items-center items-center gap-4 mb-12">
            {baggageOptions.map(({ type, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue("availableBaggage", type)}
                className={`flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-lg border transition ${
                  availableBaggage === type
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}
              >
                <Icon className="w-8 h-8" />
                <span className="text-sm font-medium">{type}</span>
              </button>
            ))}
          </div>



          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Atrás
            </Button>
            
            <Button type="submit" variant="primary">
              Crear viaje
            </Button>
          </div>
        </div>
        
      )}
    </form>
  );
}
