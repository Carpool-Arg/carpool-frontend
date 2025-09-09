'use client';

import { useState, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TripFormData, TripRequest, tripSchema } from '@/schemas/trip/tripSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Backpack, CalendarPlus, CircleDot, CircleSmall, CircleX, Clock, DollarSign, MapPin, UsersRound, X } from 'lucide-react';
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
import { useAuth } from '@/contexts/authContext';

const baggageOptions = [
  {
    value: "LIVIANO",
    type: "Liviano",
    icon: BsBackpack,
  },
  {
    value: "MEDIANO",
    type: "Mediano",
    icon: BiBriefcaseAlt,
  },
  {
    value: "PESADO",
    type: "Pesado",
    icon: BsSuitcase,
  },
  {
    value: "NO_EQUIPAJE",
    type: "Sin equipaje",
    icon: CircleX,
  },
];

export function TripForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string>('');
  const router = useRouter()
  const {user} = useAuth();

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md mx-auto md:py-8">
      
      {step === 1 && (
        // === PASO 1: Seleccionar vehículo ===
        <div className=''>
          <div className='text-center mb-4'>
            <h2 className="text-xl"><span className='font-semibold'>{user?.name}</span>, ¿con qué vehículo 
              deseas viajar hoy? 
            </h2>
          </div>

          {vehiclesError && <p className="text-sm text-red-500">{vehiclesError}</p>}

          <VehicleSelector
            selectedVehicle={selectedVehicle}
            onSelect={(vehicle) => setValue('idVehicle', vehicle.id)}
          />

          <div className="flex justify-center gap-2 mt-4">
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(2)}
              disabled={!selectedVehicleId}
              className='px-12 py-2 text-sm font-inter font-medium'
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        // === PASO 2: Seleccionar equipaje ===
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-medium">Nuevo viaje</h2>
            <button
              type="button"
              className="text-sm text-gray-400 underline"
              onClick={() => setStep(1)}
            >
              Cambiar vehículo
            </button>
          </div>

          {selectedVehicle && (
            <div className='flex items-center p-3 mb-3 border rounded-lg border-gray-5/75 gap-4'>
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
                  placeholder='Localidad origen'
                  icon={<CircleSmall size={18} />}
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
                  placeholder='Localidad destino'
                  icon={<MapPin size={16} />}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium font-inter">Fecha y hora de salida</label>
            <input
              type="datetime-local"
              {...register('startDateTime', { required: 'La fecha y hora son obligatorias' })}
              className="w-full p-2 rounded border border-gray-2 text-white"
            />
            {errors.startDateTime && (
              <p className="text-xs text-red-500 mt-1">{errors.startDateTime.message}</p>
            )}
          </div>
          


          <div className="grid grid-cols-2 gap-4">
            {/* Asientos disponibles */}
            <div>
              <label className="block mb-1 text-sm font-medium font-inter">
                Asientos disponibles
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-1/65">
                  <UsersRound size={20} />
                </span>

                <input
                  type="number"
                  min={1}
                  {...register("availableSeat", {
                    required: "Debe indicar los asientos disponibles",
                    valueAsNumber: true,
                  })}
                  className="w-full pl-10 pr-3 py-2 rounded border dark:border-gray-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              {errors.availableSeat && (
                <p className="text-red-500 text-sm mt-1">{errors.availableSeat.message}</p>
              )}
            </div>

            {/* Precio por asiento */}
            <div>
              <label className="block mb-1 text-sm font-medium font-inter">
                Precio por asiento
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-1/65">
                  <DollarSign size={20} />
                </span>

                <input
                  type="number"
                  min={1}
                  {...register("seatPrice", {
                    required: "Debe indicar el precio por asiento",
                    valueAsNumber: true,
                  })}
                  className="w-full pl-10 pr-3 py-2 rounded border dark:border-gray-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              {errors.seatPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.seatPrice.message}</p>
              )}
            </div>
          </div>

          

          <div className="flex justify-center gap-2 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(1)}
              className='px-15 py-2 text-sm font-inter font-medium'
            >
              Atrás
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(3)}
              disabled={!selectedVehicleId}
              className='px-12 py-2 text-sm font-inter font-medium'
            >
              Siguiente
            </Button>
          </div>
        </div>
        
      )}

      {step === 3 && (
        // === PASO 3: Completar resto del form ===
        <div className='flex flex-col justify-center items-center'>
          <h2 className="text-xl text-center font-medium mb-16 ">
            Seleccioná el equipaje que cargará cada pasajero
          </h2>

          <div className="grid grid-cols-2 justify-items-center gap-8 mb-12">
            {baggageOptions.map(({ type, icon: Icon, value}) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("availableBaggage", value)}
                className={`cursor-pointer flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-2xl border transition ${
                  availableBaggage === value
                    ? "bg-gray-6 text-gray-2 border-gray-5"
                    : "text-gray-1 border-gray-2"
                }`}
              >
                <Icon className="w-12 h-12" />
                <span className="font-medium font-inter">{type}</span>
              </button>
            ))}
          </div>



          <div className="flex justify-center gap-4 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(2)}
              className='px-15 py-2 text-sm font-inter font-medium'
            >
              Atrás
            </Button>
            <Button
              type="submit"
              variant="primary"
              className='px-12 py-2 text-sm font-inter font-medium'
            >
              Crear viaje
            </Button>
          </div>
        
        </div>
        
      )}
    </form>
  );
}
