'use client'

import { updateReservation } from "@/services/reservation/reservationService";

import { Loader2, TicketX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AlertDialog } from "@/components/ux/AlertDialog";
import { ReservationDTO } from "../../create/types/reservation";
import Reservation from "../../create/components/Reservation";
import FilterBar from "./FilterBar";



interface TripReservationListProps {
  tripReservations: ReservationDTO[] | [];
  onLoadMore: () => void; 
  hasMore: boolean;       
  isLoadingMore: boolean; 
}

export default function TripReservationList({
    tripReservations, 
    onLoadMore, 
    hasMore, 
    isLoadingMore 
}: TripReservationListProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);    
  const [loadingAcceptId, setLoadingAcceptId] = useState<number | null>(null);
  const [loadingRejectId, setLoadingRejectId] = useState<number | null>(null);

  const [alertData, setAlertData] = useState<{
    type: "success" | "error" | "info" | null;
    title?: string;
    description?: string;
    onConfirm?: () => void;
  } | null>(null);

    // Observer para el scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
        const target = entries[0];
        // Si es visible y hay más datos por cargar, avisamos al padre
        if (target.isIntersecting && hasMore && !isLoadingMore) {
            onLoadMore();
        }
        },
        {
        rootMargin: "100px", // Un poco antes de llegar al final
        threshold: 0.1,
        }
    );

    const currentRef = loaderRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
        if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, isLoadingMore, onLoadMore, tripReservations.length]); 

  const handleAcceptReservation = async (idReservation: number) =>{
    setLoadingAcceptId(idReservation);
    try {
        const result = await updateReservation({ idReservation, reject: false });
        if (result?.state === 'OK') {
            setAlertData({
                type: "success",
                title: "¡Reserva aceptada con éxito!",
                description: "Se le notificará al pasajero.",
                onConfirm: () => window.location.reload(),
            });
        }else{
            setAlertData({
                type: "error",
                title: "Hubo un problema",
                description: result.messages[0],
                onConfirm: () => window.location.reload(),
            });
        }
    } catch (error) {
        setAlertData({
            type: "error",
            title: "Hubo un problema",
            description: "No se pudo aceptar la reserva.",
            onConfirm: () => window.location.reload(),
        });
        console.error("Error al aceptar la reserva", error);
    }finally{
        setLoadingAcceptId(null);
    }
  }

    const handleRejectReservation = async (idReservation: number) => {
        setLoadingRejectId(idReservation);
        try {
            const result = await updateReservation({idReservation, reject: true });
            if (result?.state === 'OK') {
              window.location.reload();
            }else{
                setAlertData({
                    type: "error",
                    title: "Hubo un problema",
                    description: result.messages[0],
                    onConfirm: () => window.location.reload(),
                });
            }
        } catch (error) {
            setAlertData({
                type: "error",
                title: "Hubo un problema",
                description: "No se pudo aceptar la reserva.",
                onConfirm: () => window.location.reload(),
            });
            console.error("Error al rechazar la reserva", error);
        }finally{
            setLoadingRejectId(null);
        }
    }

  const handleConfirm = (scope: 'ACCEPT'|'REJECT',idReservation: number)=>{
    if(scope==="ACCEPT"){
        setAlertData({
            type: "info",
            title: "Aceptar Reserva",
            description: "¿Estás seguro de que deseas aceptar esta reserva?",
            onConfirm: () => handleAcceptReservation(idReservation),
        });
    }
    if(scope === 'REJECT'){
        setAlertData({
            type: "info",
            title: "Rechazar Reserva",
            description: "¿Estás seguro de que deseas rechazar esta reserva?",
            onConfirm: () => handleRejectReservation(idReservation),
        });
    }
  }

  if (tripReservations.length === 0) {
    return (
        <div className="flex items-center justify-center p-4 gap-4 ">
            <div className="bg-dark-1 rounded-lg p-3">
                <TicketX size={32} />
            </div>
            <div className="border border-gray-6 h-12"></div>
            <div>
                <p className="text-lg font-medium leading-tight">Este viaje no tiene reservas.</p>
            </div>
        </div>
    );
  }

  return (
      <div>
          {tripReservations.map((reservation, index) => {
              return (
                  <div key={`${reservation.id}-${index}`}> {/* Key única compuesta por si acaso */}
                    <div className="cursor-pointer block">
                        <Reservation 
                          reservation={reservation}
                          onAccept={() => handleConfirm('ACCEPT', reservation.id)}
                          onReject={() => handleConfirm("REJECT", reservation.id)} 
                          isAccepting={loadingAcceptId === reservation.id}
                          isRejecting={loadingRejectId === reservation.id}
                        /> 
                    </div>
                  </div>
              );
          })}
      
          {/* Elemento centinela para el Observer */}
          <div ref={loaderRef} className="py-6 flex justify-center w-full">
             {isLoadingMore && (
                 <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span className="text-sm">Cargando más reservas...</span>
                 </div>
             )}
             
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