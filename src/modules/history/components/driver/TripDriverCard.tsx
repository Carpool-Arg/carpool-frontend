import { Toast } from "@/components/ux/Toast";
import { R2_PUBLIC_PREFIX } from "@/constants/imagesR2";
import { useTrip } from "@/contexts/tripContext";
import { TripDriverDTO } from "@/modules/driver-trips/types/tripDriver";
import { formatDateTime } from "@/shared/utils/dateTime";
import { formatDomain } from "@/shared/utils/domain";
import { getClockIcon } from "@/shared/utils/getTimeIcon";
import { capitalizeWords } from "@/shared/utils/string";
import { Ban, ChevronRight, Ellipsis, Loader2, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { tripButtonConfig } from "./TripStateButton";
import { AlertDialog } from "@/components/ux/AlertDialog";
import { CancelReasonModal } from "../CancelReasonModal";
import { cancelTrip } from "@/services/trip/tripService";

interface TripCardProps {
  trip: TripDriverDTO;
  onError?: (message: string) => void;
  onSuccess?: (message: string) => void;
  openMenuTripId: number | null;
  setOpenMenuTripId: (id: number | null) => void;
}

export function TripDriverCard({ trip ,onError, onSuccess, openMenuTripId, setOpenMenuTripId}: TripCardProps) {
  const [state, setState] = useState('CREATED')
  const startDate = new Date(trip.startDateTime);
  const ClockIcon = getClockIcon(startDate);
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string, type: 'error' | 'warning' } | null>(null);
  const { refetchCurrentTrip } = useTrip()
  const [loading, setLoading] = useState(false);
  const [isReasonModalOpen, setReasonModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [isCancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  const isMenuOpen = openMenuTripId === trip.id;

  const canCancel =
  (trip.tripState === "CREATED" || trip.tripState === "CLOSED");
  
  const cancelDescription = trip.hasReservations
    ? "Este viaje tiene reservas activas. Se notificará a los pasajeros y deberán ser reembolsados. ¿Deseás continuar?"
    : "¿Estás seguro que querés cancelar este viaje?";
  
  useEffect(() => {
    setState(trip.tripState)
  }, [trip.tripState])


  const handleStartCancel = () => {
    if (trip.hasReservations) {
      setReasonModalOpen(true);
    } else {
      setCancelReason(null);
      setCancelDialogOpen(true);
    }
  };

  const handleConfirmCancel = async () => {
    if (loading) return;

    setCancelDialogOpen(false);
    setLoading(true);

    try {
      const response = await cancelTrip(trip.id, cancelReason ?? undefined);

      if (response.state === "ERROR") {
        onError?.(response.messages?.[0] ?? "Error al cancelar el viaje");
        return;
      }

      onSuccess?.("Viaje cancelado correctamente");

      if (isReasonModalOpen) {
        setReasonModalOpen(false);  
      }
    } finally {
      setLoading(false);
      setCancelReason(null);
    }
  };

  const handleClick = async () => {
    if (disabled || loading) return;

    setLoading(true);

    try {
      const result = await onClick(trip.id.toString());

      if (!result.ok) {
        onSuccess?.(result.message);
        return;
      }

      switch (state) {
        case "CLOSED":
          await refetchCurrentTrip();
          router.push(`/current-trip`);
          break;

        default:
          console.warn("Estado no manejado", state);
      }
    } finally {
      setLoading(false);
    }
    
  };

  const config =  tripButtonConfig[trip.tripState];

  const { label, Icon, className, disabled, onClick} = config;
 
  return (
    <div  className="trip-card mb-4 p-4 border border-gray-2 rounded-lg shadow-sm transition-all duration-20">
      {/* Ruta */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <span>{trip.startCity}</span>
          <span className="px-0.5 py-0.5 bg-gray-7 rounded-full"><ChevronRight size={14}/></span>
          <span>{trip.destinationCity}</span>
           
        </div>
        <span className="text-base font-semibold">
          ${trip.seatPrice}
        </span>
      </div>

      {/* Fecha */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center text-xs text-gray-6 mb-2 bg-gray-7 gap-1 px-2 py-1     rounded-xl font-inter">
          <span><ClockIcon size={14} /></span>
          <span>{formatDateTime(startDate?.toISOString())}</span>
        </div>
        <div className="inline-flex gap-2 items-center text-xs text-gray-6 mb-2 bg-gray-7 px-3 py-1 rounded-xl font-inter">
          <span>{capitalizeWords(trip.tripState)}</span>
          <span className="bg-white h-1.5 w-1.5 rounded-full"></span>
        </div>
      </div>
      

      {/* Info secundaria */}
      <div className="flex items-center justify-between text-xs text-gray-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 relative shrink-0 ">
            <Image
              src={`${R2_PUBLIC_PREFIX}/${(trip.vehicle.vehicleTypeName).toLowerCase()}.png`}
              alt={`Imagen Tipo Vehiculo ${(trip.vehicle.vehicleTypeName).toLowerCase()}`}
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">
              {trip.vehicle.brand} {trip.vehicle.model}
            </span>
            <span className="font-inter">
              {formatDomain(trip.vehicle.domain)}
            </span>
          </div>
          
        </div>

        <div className="relative">
          <button
              onClick={() =>
                setOpenMenuTripId(isMenuOpen ? null : trip.id)
              }            
              className={`
              p-2 rounded-full
              text-sm font-medium
              transition-all duration-200
              ${isMenuOpen
                ? "bg-white text-black"
                : "bg-gray-7 text-gray-6 hover:bg-gray-6 hover:text-gray-8"
              }
              cursor-pointer
            `}
          >
            <Ellipsis size={16} />
          </button>

        {isMenuOpen && (
          <div
            className="
              absolute right-0 mt-2 w-56
              bg-[#1a1a1a] border border-gray-700
              rounded-xl shadow-lg
              p-2
              z-50
              space-y-1
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Acción principal */}
            <button
              disabled={disabled || loading}
              onClick={() => {
                setOpenMenuTripId(null);
                handleClick();
              }}
              className={`
                w-full flex items-center gap-2
                px-3 py-2 rounded-lg text-sm
                transition-all duration-200
                bg-gray-7 text-gray-6
                hover:bg-gray-6 hover:text-gray-8 hover:font-semibold
                disabled:opacity-60 disabled:cursor-not-allowed
                cursor-pointer
                ${className}
              `}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Icon size={16} />
              )}
              {label}
            </button>

            <button
              className={`
                w-full flex items-center gap-2
                px-3 py-2 rounded-lg text-sm
                transition-all duration-200
                bg-gray-7 text-gray-6
                hover:bg-gray-6 hover:text-gray-8 hover:font-semibold
                disabled:opacity-60 disabled:cursor-not-allowed
                cursor-pointer
              `}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Pencil size={16} />
              )}
                Editar
            </button>

            {/* Cancelar */}
            {canCancel && (
              <button
                onClick={() => {
                  setOpenMenuTripId(null);
                  handleStartCancel();
                }}
                className="
                  w-full flex items-center gap-2
                  px-3 py-2 rounded-lg text-sm
                  text-red-500
                  bg-red-500/10
                  hover:bg-red-500/20
                  transition-all duration-200
                  cursor-pointer
                "
              >
                <Ban size={16} />
                Cancelar
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      {toast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-100 w-full max-w-[90%] sm:max-w-md pointer-events-none flex justify-center">
              <div className="pointer-events-auto w-full">
                  <Toast
                      message={toast.message}
                      type={toast.type}
                      onClose={() => setToast(null)}
                  />
              </div>
          </div>
      )}

      <AlertDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        type="info"
        title="Cancelar viaje"
        description={cancelDescription}
        confirmText="Sí, cancelar"
        cancelText="Volver"
      />

      <CancelReasonModal
        isOpen={isReasonModalOpen}
        onClose={() => setReasonModalOpen(false)}
        loading={loading}
        onConfirm={(reason) => {
          setCancelReason(reason);
          setCancelDialogOpen(true);  
        }}
      />
    </div>

  );
}
