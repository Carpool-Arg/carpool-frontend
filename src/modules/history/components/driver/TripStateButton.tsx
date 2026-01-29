import { startTrip } from "@/services/trip/tripService";
import type { LucideIcon } from "lucide-react";
import {
  CalendarSync,
  IterationCcw,
  LucideEye
} from "lucide-react";
import { TripActionResult } from "../../types/TripActionResult";

export type TripState = string;
export type TripButtonAction = (tripId: string) => Promise<TripActionResult>;

export const tripButtonConfig: Record<
  TripState,
  {
    label: string;
    Icon: LucideIcon;
    className?: string;
    disabled?: boolean;
    onClick: TripButtonAction;
  }
> = {
  CREATED: {
    label: "Visualizar",
    Icon: LucideEye,
    onClick: async (tripId: string): Promise<TripActionResult> => {
      console.log(tripId)
      return { ok: true };
    },
  },
  CLOSED: {
    label: "Iniciar viaje",
    Icon: IterationCcw,
    onClick: async (tripId: string): Promise<TripActionResult> => {
      const response = await startTrip(tripId)

      if (response.state === "ERROR") {
        return {
          ok: false,
          message: response.messages?.[0] ?? "Error al iniciar el viaje",
        };
      }
      
      return { ok: true };
    },
  },
  FINISHED: {
    label: "Agendar",
    Icon: CalendarSync,
    onClick: async (tripId: string) => {
      console.log(tripId)
      return { ok: true };
    },
  },
};
