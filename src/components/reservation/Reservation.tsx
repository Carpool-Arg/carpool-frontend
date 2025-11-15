import { ReservationDTO } from "@/types/reservationDTO";
import Separator from "../ux/Separator";
import { Button } from "../ux/Button";

export default function Reservation(reservation: ReservationDTO) {
  return(
    <div className="trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-200">
      <div className="flex items-center">
          <div className="flex flex-col w-full mb-2">
              <div className="flex items-start justify-between w-full">
                  <div className="grid grid-cols-2 w-3/4">
                      <div className="w-full">
                          <div className="flex items-center">
                              {/* <p>{formatTime(trip.startDateTime)}</p>
                              <RouteLine/> */}
                          </div>
                      </div>
                      <div>
                          {/* <p>{formatTime(trip.estimatedArrivalDateTime)}</p> */}
                      </div>
                      <div>
                          {/* <p className="text-sm">{capitalizeWords(trip.startCity ?? '')}</p> */}
                      </div>
                      <div>
                          {/* <p className="text-sm">{capitalizeWords(trip?.destinationCity ?? '')}</p> */}
                      </div>
                  </div>

                  <div>
                      <p className="text-xl font-semibold">{reservation.nameUser}, {reservation.lastNameUser}</p>
                      <p className="flex items-center justify-end text-xl gap-1">
                      {/* {trip.currentAvailableSeats}
                      <span><UserRound size={20}/></span> */}
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <Separator color="bg-gray-2" marginY="my-2"/>

            
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="secondary">Rechazar</Button>       
          <Button variant="primary">Aceptar</Button>   
        </div>
      </div>
  </div>
  )
}