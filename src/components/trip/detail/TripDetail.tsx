import { baggageOptions } from "../TripFrom";

interface TripDetailProps {

  originName: string;
  destinationName: string;
  startDateTime: string;
  availableSeat: number;
  availableBaggage: string;
  seatPrice: number;
  vehicle: Vehicle;
}

export function TripDetail({
  originName,
  destinationName,
  startDateTime,
  availableSeat,
  availableBaggage,
  seatPrice,
  vehicle,
}: TripDetailProps) {
  const selectedBaggage = baggageOptions.find(
    (b) => b.value === availableBaggage
  );

  const BaggageIcon = selectedBaggage?.icon;
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto gap-6">
      <h2 className="text-2xl font-semibold text-center">Detalle del viaje</h2>
      {/* Información adicional */}
      
      <div className="w-full p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <p className="flex flex-col">
            <span className="font-medium">Origen</span> 
            <span>{originName}</span>
          </p>
           <p className="flex flex-col">
            <span className="font-medium">Destino</span> 
            <span>
              {destinationName}
            </span>
          </p>
        </div>
       
        <p className="flex flex-col">
          <span className="font-medium">Horario de salida</span>
          <span className="font-regular text-sm">
            {new Date(startDateTime).toLocaleDateString('es-AR', {
              day: 'numeric',    // día del mes: 16
              month: 'long',     // nombre del mes: septiembre
              year: 'numeric',   // año: 2025
            })}
          </span>
          <span className="text-2xl font-bold">{new Date(startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
        </p>
        <p className="flex flex-col">
          <span className="font-medium">Precio por pasajero:</span> 
          <span className="text-2xl font-bold">${seatPrice}</span>
        </p>

        <p className="flex flex-col">
          <span className="font-medium">Vehículo</span> 
          <span>{vehicle.brand} {vehicle.model}</span>
          <span>{vehicle.domain} </span>
        </p>

        <p className="flex flex-col">
          <span className="font-medium">Asientos disponibles:</span> {availableSeat}
        </p>
        <p className="flex flex-col">
          <span className="font-medium">Equipaje permitido:</span> 
          {selectedBaggage?.type}
          {BaggageIcon && <BaggageIcon />}
        </p>
        
        
      </div>
    </div>
  );
}
