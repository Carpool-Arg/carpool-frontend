'use client';

import { useAuth } from '@/contexts/authContext';
import { useUserVehicles } from '@/hooks/useUserVehicles';
import { TripFormData, tripSchema } from '@/schemas/trip/tripSchema';
import { newTrip } from '@/services/tripService';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleSmall, CircleX, DollarSign, MapPin, UsersRound } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BiBriefcaseAlt } from 'react-icons/bi';
import { BsBackpack, BsSuitcase } from 'react-icons/bs';
import { CityAutocomplete } from '../city/CityAutocomplete';
import { Button } from '../ui/Button';
import { VehicleSelector } from './VehicleSelector';
import { TripStopForm } from './stops/TripStopsForm';
import { TripStop, TripStopExtended } from '@/types/tripStop';
import { TripRoutePreview } from './TripRoutePreview';


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
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [error, setError] = useState<string>('');
  const router = useRouter()
  const {user} = useAuth();
  const [tripStops, setTripStops] = useState<TripStop[]>([])

  const [originName, setOriginName] = useState<string>('');
  const [destinationName, setDestinationName] = useState<string>('');

  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors , isValid}, 
    setValue, 
    watch 
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    mode: 'onChange',
    defaultValues: {
      startDateTime: '',
      originCityId: 0,
      destinationCityId: 0,
      availableSeat: 1,
      availableBaggage: '',
      seatPrice: 0,
      idVehicle: 0,
      tripStops: []  
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


  const handleTripStopsSubmit = (stops: { cityId: number; cityName: string; observation: string }[]) => {
    const formattedStops: TripStopExtended[] = stops.map((stop, index) => ({
      ...stop,
      order: index + 1,
      start: false,
      destination: false
    }));
    setTripStops(formattedStops);
  };

  // Dentro de TripForm
  const buildTripRoute = (): TripStop[] => {
    console.log('entra')
    const originId = watch("originCityId");
    const destinationId = watch("destinationCityId");

    if (!originId || !destinationId) return [];

    return [
      {
        cityId: originId,
        cityName: originName || "Origen",
        start: true,
        destination: false,
        order: 1,
        observation: ""
      },
      ...tripStops.map((stop, index) => ({
        ...stop,
        start: false,
        destination: false,
        order: index + 2
      })),
      {
        cityId: destinationId,
        cityName: destinationName || "Destino",
        start: false,
        destination: true,
        order: tripStops.length + 2,
        observation: ""
      }
    ];
  };





  const onSubmit = async (data: TripFormData) => {
    const stops = tripStops || [];

    const payloadTripStops = [
      {
        cityId: data.originCityId,
        start: true,
        destination: false,
        order: 1,
        observation: ''
      },
      ...stops.map((stop, index) => ({
        cityId: stop.cityId,
        start: false,
        destination: false,
        order: index + 2,
        observation: stop.observation
      })),
      {
        cityId: data.destinationCityId,
        start: false,
        destination: true,
        order: stops.length + 2,
        observation: ''
      }
    ];

    try {
      const payload = {
        ...data,
        tripStops: payloadTripStops
      };

      const response = await newTrip(payload);

      if (response.state === "ERROR") {
        setError(response.messages?.[0] || "Error al guardar el viaje");
        return;
      }

      router.push('/profile');
    } catch (error) {
      setError("Error al crear el viaje");
    }
  };

  if (vehicles.length === 0 && !vehiclesLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full">
        <Image
          src="/vehicles.svg"
          alt="Imagen de vehículo claro"
          width={200}
          height={166}
          className="block dark:hidden"
        />

        <Image
          src="/vehicles-dark.svg"
          alt="Imagen de vehículo oscuro"
          width={200}
          height={166}
          className="hidden dark:block"
        />
        <h1 className='text-2xl font-semibold text-center leading-7 mt-8'>
          No tenes vehículos <br/> para realizar un viaje 
        </h1>
        <p className='font-inter mt-8'>¿Deseas registrar uno?</p>
        <div className="flex justify-center gap-2 mt-8">
          <Button 
            type="button" 
            variant="outline" 
            onClick={()=>router.back()}
            className='px-5 py-2 text-sm font-inter font-medium'
          >
            Volver
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={()=>router.push('/vehicle')}
            className='py-2 text-sm font-inter font-medium'
          >
            Registrar
          </Button>
        </div>
      </div>
    )
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-start gap-4 h-full w-full max-w-md mx-auto md:py-8">
      {step === 1 && (
        // === PASO 1: Seleccionar vehículo ===
        <div className='flex flex-col justify-between h-full'>
          <div>
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
          </div>

          <div className="flex justify-center gap-2 mt-12">
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
        // === PASO 2: Datos viaje ===
        <div className="flex flex-col justify-between h-full">
          <div className='space-y-5'>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-medium">Nuevo viaje</h2>
              <button
                type="button"
                className="text-sm text-gray-5 underline"
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
                  <p className="text-xs text-dark-4 dark:text-gray-1 ">Patente {selectedVehicle.domain}</p>
                  <p className="text-xs dark:text-gray-1">Asientos totales {selectedVehicle.availableSeats}</p>
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
                    onChange={(city) => {
                      field.onChange(city?.id);
                      setOriginName(city?.name || '');
                    }}
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
                    onChange={(city) => {
                      field.onChange(city?.id);
                      setDestinationName(city?.name || '');
                    }}
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
                className="w-full p-2 rounded border border-gray-5 dark:border-gray-2"
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-2 dark:text-gray-1/65">
                    <UsersRound size={20} />
                  </span>

                  <input
                    type="number"
                    min={1}
                    {...register("availableSeat", {
                      required: "Debe indicar los asientos disponibles",
                      valueAsNumber: true,
                    })}
                    className="w-full pl-10 pr-3 py-2 rounded border border-gray-5 dark:border-gray-2 placeholder-gray-5 "
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-2 dark:text-gray-1/65">
                    <DollarSign size={20} />
                  </span>

                  <input
                    type="number"
                    min={1}
                    {...register("seatPrice", {
                      required: "Debe indicar el precio por asiento",
                      valueAsNumber: true,
                    })}
                    className="w-full pl-10 pr-3 py-2 rounded border border-gray-5 dark:border-gray-2 placeholder-gray-5"
                    placeholder="0"
                  />
                </div>

                {errors.seatPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.seatPrice.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-7.5 mt-8">
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
              disabled={!isValid}
              className='px-12 py-2 text-sm font-inter font-medium'
            >
              Siguiente
            </Button>
          </div>
        </div>
        
      )}

      {step === 3 && (
        // === PASO 3: Seleccionar equipaje ===
        <div className='flex flex-col justify-between h-full items-center'>
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
                  className={`cursor-pointer flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-2xl  transition ${
                    availableBaggage === value
                      ? "bg-gray-6 text-gray-2 border border-gray-4"
                      : "text-dark-3 dark:text-gray-1"
                  }`}
                >
                  <Icon className="w-12 h-12" />
                  <span className="font-medium font-inter">{type}</span>
                </button>
              ))}
            </div>
          </div>
         



          <div className="flex justify-center gap-7.5 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(2)}
              className='px-15 py-2 text-sm font-inter font-medium'
            >
              Atrás
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(4)}
              disabled={!isValid}
              className='px-12 py-2 text-sm font-inter font-medium'
            >
              Siguiente
            </Button>
          </div>
        
        </div>
        
      )}

      {step === 4 && (
        <div className='flex flex-col justify-between h-full items-center'>
          <div className='flex flex-col items-center gap-8 justify-center h-full'>
            <Image src={"/map-pin-2.svg"} 
              alt='Imagen MapPin' 
              width={121}
              height={0}
              priority
              className='h-auto'
              />
            <h1 className="text-2xl text-center font-semibold">
              ¿Deseas sumar paradas intermedias?
            </h1>
          </div>
          <div className="flex justify-center gap-7.5">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(2)}
              className='px-6 py-2 text-sm font-inter font-medium'
            >
              No
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(5)}
              className='px-6 py-2 text-sm font-inter font-medium'
            >
              Si
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <TripStopForm
          initialStops={tripStops} 
          onSubmitTripStops={handleTripStopsSubmit}
          onNext={() => setStep(6)} // por ejemplo, siguiente paso después de stops
          onBack={() => setStep(4)} // volver al paso 4
        />
      )}

      {step === 6 && (
        <div className="flex flex-col justify-between h-full items-center">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-8">
            <h2 className="text-2xl text-center font-semibold mb-6">
              Recorrido del viaje
            </h2>

            <TripRoutePreview
              tripStops={buildTripRoute()}
            />
          </div>

          <div className="flex justify-center gap-7.5 mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(5)}
              className='px-15 py-2 text-sm font-inter font-medium'
            >
              Atrás
            </Button>
            <Button
              type="submit"
              variant="primary"
              className='px-12 py-2 text-sm font-inter font-medium'
            >
              Finalizar
            </Button>
          </div>
        </div>
      )}


      
    </form>
  );
}
