import { EmptyAlert } from "@/components/ux/EmptyAlert";
import { TicketX } from "lucide-react";
import Reservation from "../../create/components/Reservation";
import { ReservationDTO } from "../../create/types/reservation";

interface ReservationListProps {
  reservations: ReservationDTO[];
  onCancel: (reservation: ReservationDTO) => void;
  loadingCancelId?: number | null;
}

export default function ReservationList({
  reservations,
  onCancel,
  loadingCancelId
}: ReservationListProps) {

  if (reservations.length === 0) {
    return (
        <EmptyAlert
          icon={<TicketX size={32} />}
          title="No tienes reservas"
        />
    );
  }

  return (
    <div>
      {reservations.map((reservation, index) => (
          <div key={`${reservation.id}-${index}`}>
              <div className="cursor-pointer block">
                  <Reservation
                      reservation={reservation}
                      variant="PASSENGER"
                      onCancel={() => onCancel(reservation)}
                      isCanceling={loadingCancelId === reservation.id}
                  />
              </div>
          </div>
      ))}
    </div>
  );
}