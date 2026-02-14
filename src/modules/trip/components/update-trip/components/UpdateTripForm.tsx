'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTripDetails } from "../hooks/useTripData";
import { Input } from "@/components/ux/Input";
import { Button } from "@/components/ux/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { TripFormData, tripSchema } from "@/modules/trip/schemas/tripSchema";
import { useForm } from "react-hook-form";
import { CityAutocomplete } from "@/modules/city/components/CityAutocomplete";
import { TripStop } from "@/models/tripStop";
import { ArrowLeftRight, Circle, DollarSign, Repeat, Square, UsersRound } from "lucide-react";
import Image from "next/image";
import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import { formatDomain } from "@/shared/utils/domain";
import InfoTooltip from "@/components/ux/InfoTooltip";
import { Vehicle } from "@/models/vehicle";
import { VehicleResponseTripDTO } from "@/modules/driver-trips/types/vehicleTrip";
import { VehicleSelector } from "../../new-trip/VehicleSelector";
import { useAuth } from "@/contexts/authContext";

type UpdateTripDTO = {
  seatPrice: number;
  availableSeat: number;
  availableBaggage: string;
  startDateTime: string;
  vehicle: {
    brand: string;
    model: string;
    color: string;
    domain: string;
  };
};

export function UpdateTripForm() {
  const { id } = useParams();
  const { trip, loading, error } = useTripDetails(Number(id));
  const {user} = useAuth()
  const [step, setStep] = useState<number>(0);

  const [origin, setOrigin] = useState<TripStop>({
    cityId: 0,
    cityName: "",
    start: true,
    destination: false,
    order: 1,
    observation: ""
  })

  const [destination, setDestination] = useState<TripStop>({
    cityId: 0,
    cityName: "",
    start: false,
    destination: true,
    order: 1,
    observation: ""
  })

  const [tripVehicle, setTripVehicle]= useState<VehicleResponseTripDTO>()
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>()

  const [submitting, setSubmitting] = useState(false);

  const { handleSubmit, register, watch, setValue, trigger,reset, formState: { errors , isValid},  }  = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    mode: 'onChange',
    defaultValues: {
      startDateTime: '',
      availableSeat: 0,
      seatPrice: undefined,
      originId: 0,
      originObservation: '',
      destinationId: 0,
      destinationObservation: '',
      tripStops: []
    }
  })

  const selectedVehicleId = watch('idVehicle');

  useEffect(() => {
    if (!trip) return;
    setOrigin(trip.tripStops[0])
    setDestination(trip.tripStops.find(stop=> stop.destination)!)
    setTripVehicle(trip.vehicle)
    reset({
      startDateTime: trip.startDateTime.slice(0, 16),
      seatPrice: trip.seatPrice
    })
    
  }, [trip]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar el viaje</p>;

  return (
    <form className="w-full md:mt-4">
      {step === 0 &&
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between p-4 bg-gray-7 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 relative shrink-0 ">
                <Image
                  src={`${R2_PUBLIC_PREFIX}/${(trip?.vehicle.vehicleTypeName ?? 'auto').toLowerCase()}.png`}
                  alt={`Imagen Tipo Vehiculo ${(trip?.vehicle.vehicleTypeName ?? 'auto').toLowerCase()}`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">
                  {trip?.vehicle.brand} {trip?.vehicle.model}
                </span>
                <span className="font-inter text-sm">
                  {trip?.vehicle.domain}
                </span>
              </div>
              
            </div>
            <button className="bg-gray-2 p-2 rounded-full">
              <Repeat/>
            </button>
          </div>
          <div className="">
            <CityAutocomplete
              value={origin?.cityId ?? 0}
              onChange={(city) => {
                setOrigin(prev => ({
                  cityId: city?.id ?? 0,
                  start: true,
                  destination: false,
                  order: 1,
                  observation: prev?.observation || '',
                  cityName: city?.name ?? ""
                }));
                setValue("originId", city?.id ?? 0, { shouldValidate: true });
              }}
              error={errors.originId?.message}
              label="Desde"
              placeholder="Localidad origen"
              icon={
                <Circle
                  size={10}
                  className="stroke-gray-5 fill-gray-5 dark:stroke-gray-1 dark:fill-gray-1"
                />
              }
              excludeIds={[destination?.cityId ?? 0]}
              outline={true}
            />
            <input
              type="text"
              placeholder="Punto de encuentro (ej: Plaza principal)"
              {...register(`originObservation`, {
                required: "La observación del origen es obligatoria",
              })}
              value={origin?.observation || ""}
              onChange={(e) => {
                setOrigin({ ...origin, observation: e.target.value });
                setValue("originObservation", e.target.value, { shouldValidate: true });
              }}
              className="w-full p-2 mt-1 rounded-b-lg bg-gray-7"
            />
            {errors.originObservation && (
              <p className="text-xs text-red-500 mt-1">
                {errors.originObservation.message}
              </p>
            )}
          </div>

          <div className="">
            <CityAutocomplete
              value={destination?.cityId ?? 0}
              onChange={(city) => {
                setDestination(prev => ({
                  cityId: city?.id ?? 0,
                  start: false,
                  destination: true,
                  order: 9999,
                  observation: prev?.observation || '',
                  cityName: city?.name || ""
                }));
                setValue("destinationId", city?.id ?? 0, { shouldValidate: true });
              }}
              error={errors.destinationId?.message}
              label="Hasta"
              placeholder="Localidad destino"
              icon={
                <Square
                  size={10}
                  className="stroke-gray-5 fill-gray-5 dark:stroke-gray-1 dark:fill-gray-1"
                />
              }
              excludeIds={[origin?.cityId ?? 0]}
              outline={true}
            />
            <input
              type="text"
              placeholder="Punto de destino (ej: Terminal de buses)"
              {...register(`destinationObservation`, {
                required: "La observación del destino es obligatoria",
              })}
              value={destination?.observation || ""}
              onChange={(e) => {
                setDestination({ ...destination, observation: e.target.value });
                setValue("destinationObservation", e.target.value, { shouldValidate: true });
              }}
              className="w-full p-2 mt-1 rounded-b-lg bg-gray-7"
            />
            {errors.destinationObservation && (
              <p className="text-xs text-red-500 mt-1">
                {errors.destinationObservation.message}
              </p>
            )}

          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium font-inter">Fecha y hora de salida</label>
            <input
              type="datetime-local"
              {...register('startDateTime')}
              className="w-full p-2 rounded border border-gray-5 dark:border-gray-2"
              step="60"
            />
            {errors.startDateTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startDateTime.message}</p>
            )}
            
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Asientos disponibles */}
            <div>
              <label className="flex mb-1 items-center text-sm font-medium font-inter gap-1">
                Asientos disponibles
                <InfoTooltip text="Cantidad de asientos disponibles para pasajeros"></InfoTooltip>
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
                  className="w-full pl-10 pr-3 py-2 rounded border border-gray-5 dark:border-gray-2 placeholder-gray-5"
                  placeholder="0"
                />

              </div>
              <p className="text-red-500 text-sm mt-1">
                
              </p>
            
            </div>

            {/* Precio por asiento */}
            <div>
              <label className="flex mb-1 items-center text-sm font-medium font-inter gap-1">
                Precio por asiento
                <InfoTooltip text="El precio ingresado corresponde al valor antes de comisiones. El monto que recibirás será menor una vez aplicadas las tarifas de la plataforma"></InfoTooltip>
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-2 dark:text-gray-1/65">
                  <DollarSign size={20} />
                </span>

              <input
                type="text"
                inputMode="numeric"
                {...register("seatPrice", {
                  setValueAs: (value) => {
                    const cleaned = String(value).replace(/\D+/g, "");
                    return cleaned ? Number(cleaned) : undefined;
                  },
                })}
                onInput={(e) => {
                  const el = e.target as HTMLInputElement;
                  el.value = el.value.replace(/\D+/g, "");
                }}
                className="w-full pl-10 pr-3 py-2 rounded border"
                placeholder="Ej. 1000"
              />
            </div>
              {errors.seatPrice && (
                <p className="text-red-500 text-sm mt-1">{errors.seatPrice.message}</p>
              )}
            </div>
          </div>
        </div>
      }

      {step === 1 &&
        <div className='flex flex-col justify-between h-full'>
          <div>
            <div className='text-center mb-4'>
              <h2 className="text-2xl"><span className='font-semibold'>{user?.name}</span>, ¿con qué vehículo 
                deseas viajar hoy? 
              </h2>
            </div>

            {/* {vehiclesError && <p className="text-sm text-red-500">{vehiclesError}</p>} */}

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
      }
      

      <Button type="submit" disabled={submitting}>
        {submitting ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
