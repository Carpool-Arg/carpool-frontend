import { updateReservation } from "@/services/reservationService";
import { ReservationDTO } from "@/types/reservationDTO";
import { formatISOToShortDate } from "@/utils/date";
import { capitalizeWords } from "@/utils/string";
import { Circle, Square, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdOutlineBackpack, MdOutlineNoBackpack } from "react-icons/md";
import { AlertDialog } from "../ux/AlertDialog";
import { Button } from "../ux/Button";
import Separator from "../ux/Separator";

export interface ReservationProps {
    reservation: ReservationDTO;
}


export default function Reservation({ reservation }: ReservationProps) {
    const router = useRouter();

    const [alertData, setAlertData] = useState<{
        type: "success" | "error" | "info" | null;
        title?: string;
        description?: string;
        onConfirm?: () => void;
    } | null>(null);

    const handleConfirm = () => {
        setAlertData({
            type: "info",
            title: "Confirmar Reserva",
            description: "¿Estás seguro de que deseas confirmar esta reserva?",
            onConfirm: () => handleAcceptReservation(),
        });
    }

    const handleReject = () => {
        setAlertData({
            type: "info",
            title: "Rechazar Reserva",
            description: "¿Estás seguro de que deseas rechazar esta reserva?",
            onConfirm: () => handleRejectReservation(),
        });
    }

    const handleAcceptReservation = async () => {
        try {
            const result = await updateReservation({ idReservation: reservation.id, reject: false });
            if (result?.state === 'OK') {
                setAlertData({
                    type: "success",
                    title: "¡Reserva aceptada con éxito!",
                    description: "Se le notificará al pasajero.",
                    onConfirm: () => router.refresh(),
                });
            }
        } catch (error) {
            console.error("Error al aceptar la reserva", error);
        }
    }

    const handleRejectReservation = async () => {
        try {
            const result = await updateReservation({ idReservation: reservation.id, reject: true });
            if (result?.state === 'OK') {
                setAlertData({
                    type: "success",
                    title: "¡Reserva rechazada con éxito!",
                    description: "Se le notificará al pasajero.",
                    onConfirm: () => router.refresh(),
                });
            }
        } catch (error) {
            console.error("Error al rechazar la reserva", error);
        }
    }

    return (
        <div className="trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-200">


            <div className="flex items-center gap-4 w-full justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        src={reservation.urlImage}
                        alt={"Foto de perfil del pasajero"}
                        width={30}
                        height={30}
                        className="rounded-full object-cover border"
                    />

                    <div className="flex items-end gap-4">
                        <p className="text-xl">{reservation.nameUser} {reservation.lastNameUser}</p>
                        <p className={`flex items-center gap-1 text-success`}>
                            5.0
                            <span>
                                <Star size={12} fill="currentColor" />
                            </span>
                        </p>
                    </div>
                </div>
                <p>{formatISOToShortDate(reservation.createdAt)}</p>
            </div>


            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col items-center">

                        <Circle size={12} stroke="currentColor"/>

                        <div className="w-0.5 h-5 bg-gray-5 my-1"></div>
                        <Square size={12} fill="currentColor" stroke="currentColor" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="font-medium">{capitalizeWords(reservation.startCity)}</p>
                        <p className="font-medium">{capitalizeWords(reservation.destinationCity)}</p>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    {reservation.baggage ? (
                        <>
                        <span className="text-4xl p-2 rounded-full bg-gray-8">
                            <MdOutlineBackpack />
                        </span>
                        <p>Con equipaje</p>
                        </>
                    ) : (
                        <>
                        <span className="text-4xl p-2 rounded-full bg-gray-8">
                            <MdOutlineNoBackpack />
                        </span>
                        <p>Sin equipaje</p>
                        </>
                    )}
                </div>
            </div>





            <Separator color="bg-gray-2" marginY="my-2" />


            <div className="flex items-center gap-6 justify-end">
                <Button variant="outline" onClick={() => handleReject()}>Rechazar</Button>
                <Button variant="primary"  className="px-5" onClick={() => handleConfirm()}>Aceptar</Button>
            </div>
            

            {alertData && (
                <AlertDialog
                    isOpen={!!alertData}
                    onClose={() => setAlertData(null)}
                    type={alertData.type ?? 'info'}
                    title={alertData.title}
                    description={alertData.description}
                    confirmText="Aceptar"
                    onConfirm={alertData.onConfirm}
                />
            )}
        </div>
    )
}