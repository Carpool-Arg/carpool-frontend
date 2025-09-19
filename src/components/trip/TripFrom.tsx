'use client';

import { useAuth } from '@/contexts/authContext';
import { useUserVehicles } from '@/hooks/useUserVehicles';
import { TripFormData, tripSchema } from '@/schemas/trip/tripSchema';
import { newTrip } from '@/services/tripService';
import { TripStop, TripStopExtended } from '@/types/tripStop';
import { zodResolver } from '@hookform/resolvers/zod';
import { Circle, CircleX, DollarSign, Square, UsersRound } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiBriefcaseAlt } from 'react-icons/bi';
import { BsBackpack, BsSuitcase } from 'react-icons/bs';
import { CityAutocomplete } from '../city/CityAutocomplete';
import { AlertDialog } from '../ui/AlertDialog';
import { Button } from '../ui/Button';
import { TripRoutePreview } from './TripRoutePreview';
import { VehicleSelector } from './VehicleSelector';
import { TripDetail } from './detail/TripDetail';
import { TripStopForm } from './stops/TripStopsForm';


interface BaggageOption {
  value: string;
  type: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const baggageOptions: BaggageOption[] = [
  { value: "LIVIANO", type: "Liviano", icon: BsBackpack },
  { value: "MEDIANO", type: "Mediano", icon: BiBriefcaseAlt },
  { value: "PESADO", type: "Pesado", icon: BsSuitcase },
  { value: "NO_EQUIPAJE", type: "Sin equipaje", icon: CircleX },
];


export function TripForm() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1);
  const [error, setError] = useState<string>('');
  const router = useRouter()
  const {user} = useAuth();
  const [tripStops, setTripStops] = useState<TripStop[]>([])

  const [originName, setOriginName] = useState<string>('');
  const [destinationName, setDestinationName] = useState<string>('');

  const [origin, setOrigin] = useState<TripStop | null>(null);
  console.log('origin',origin)
  const [destination, setDestination] = useState<TripStop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

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

  const buildTripRoute = (): TripStop[] => {

    if (!origin || !destination) return [];

    return [
      {
        cityId: origin.cityId,
        cityName: originName || "Origen",
        start: true,
        destination: false,
        order: 1,
        observation: origin.observation
      },
      ...tripStops.map((stop, index) => ({
        ...stop,
        start: false,
        destination: false,
        order: index + 2
      })),
      {
        cityId: destination.cityId,
        cityName: destinationName|| "Destino",
        start: false,
        destination: true,
        order: tripStops.length + 2,
        observation: destination.observation
      }
    ];
  };

  const onSubmit = async (data: TripFormData) => {
    if (!origin || !destination) {
      setError("Debes seleccionar origen y destino");
      return;
    }

    const payloadTripStops: TripStop[] = [
      { ...origin, order: 1 },
        ...tripStops.map((stop, index) => ({
          cityId: stop.cityId,
          observation: stop.observation,
          start: false,
          destination: false,
          order: index + 2,
        })),
      { ...destination, order: tripStops.length + 2 }
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

      setIsSuccessDialogOpen(true);
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
          <div className='space-y-3'>
            
            <h2 className="text-xl font-medium">Nuevo viaje</h2>
              
            <div className="">
              <CityAutocomplete
                value={origin?.cityId ?? 0}
                onChange={(city) => {
                  const stop: TripStop = {
                    cityId: city?.id ?? 0,
                    start: true,
                    destination: false,
                    order: 1,
                    observation: ""
                  };
                  setOrigin(stop);
                  setOriginName(city?.name || "");
                }}
                error={errors.tripStops?.[0]?.cityId?.message}
                label="Desde"
                placeholder="Localidad origen"
                icon={
                  <Circle
                    size={10}
                    className="stroke-gray-5 fill-gray-5 dark:stroke-gray-1 dark:fill-gray-1"
                  />
                }
                excludeIds={[destination?.cityId ?? 0]}
              />
              <input
                type="text"
                placeholder="Punto de encuentro (ej: Plaza principal)"
                value={origin?.observation || ""}
                onChange={(e) =>
                  setOrigin(prev => prev ? { ...prev, observation: e.target.value } : null)
                }
                className="w-full p-2 mt-2 rounded border border-gray-5 dark:border-gray-2"
              />
            </div>
            
            <div className="">
              <CityAutocomplete
                value={destination?.cityId ?? 0}
                onChange={(city) => {
                  const stop: TripStop = {
                    cityId: city?.id ?? 0,
                    start: false,
                    destination: true,
                    order: 9999, // luego se corrige
                    observation: ""
                  };
                  setDestination(stop);
                  setDestinationName(city?.name || "");
                }}
                error={errors.tripStops?.[tripStops.length - 1]?.cityId?.message}
                label="Hasta"
                placeholder="Localidad destino"
                icon={
                  <Square 
                    size={10}
                    className="stroke-gray-5 fill-gray-5 dark:stroke-gray-1 dark:fill-gray-1"
                  />
                }
                excludeIds={[origin?.cityId ?? 0]}
              />
              <input
                type="text"
                placeholder="Punto de destino (ej: Terminal de buses)"
                value={destination?.observation || ""}
                onChange={(e) =>
                  setDestination(prev => prev ? { ...prev, observation: e.target.value } : null)
                }
                className="w-full p-2 mt-2 rounded border border-gray-5 dark:border-gray-2"
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
              disabled={!availableBaggage}
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
              onClick={() => setStep(7)}
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
        <div className="flex flex-col h-screen md:pb-8 justify-between">
          {/* Contenido principal con scroll si es necesario */}
          <div className="flex-1">
            <TripStopForm
              initialStops={tripStops} 
              onSubmitTripStops={handleTripStopsSubmit}
              origin={origin?.cityId}
              destination={destination?.cityId}
              onBack={()=>setStep(4)}
              onNext={()=>setStep(6)}
            />
          </div>

        </div>
      )}

      {step === 6 && (
        <div className="flex flex-col justify-between h-full items-center">
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-8">
            <h2 className="text-2xl text-center font-semibold mb-6">
              ¿Deseas confirmar el recorrido?
            </h2>
            <div className='items-center w-full bg-gray-6 dark:bg-gray-8 py-4 px-6 rounded-lg'>
              <TripRoutePreview
                tripStops={buildTripRoute()}
              />
            </div>
            
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
              type="button"
              variant="primary"
              onClick={() => setStep(7)}
              className='px-12 py-2 text-sm font-inter font-medium'
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {step === 7 && (
        <div className='flex flex-col justify-between mb-8'>
          <TripDetail
            originName={originName}
            destinationName={destinationName}
            startDateTime={watch("startDateTime")}
            availableSeat={watch("availableSeat")}
            availableBaggage={watch("availableBaggage") || ""}
            seatPrice={watch("seatPrice")}
            vehicle={selectedVehicle!}
          />
          <div className="flex justify-center gap-7.5 my-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStep(5)}
              className='px-15 py-2 text-sm font-inter font-medium'
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              variant="primary"
              className='px-12 py-2 text-sm font-inter font-medium'
            >
              Publicar viaje
            </Button>
          </div>
        </div>
      )}
      <AlertDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleSubmit(onSubmit)} 
        type="info"
        title="¿Deseas publicar el viaje?"
        description="Una vez publicado, otros usuarios podrán ver y solicitar unirse a este viaje."
        confirmText="Publicar"
        cancelText="Cancelar"
      />
      <AlertDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        secondaryButton={{
          text: "Inicio",
          onClick: () => {
            setIsSuccessDialogOpen(false)
            router.push('/home')
          }
        }}
        onConfirm={()=>router.push('/profile')} 
        type="success"
        title="¡Listo! Tu viaje ha sido publicado"
        description="Podrás ver y gestionar tus viajes en la sección 'Mis Viajes' 🚗"
        confirmText="Mis viajes"
        cancelText="Inicio"
      />
    </form>
  );
}
