import { startTrip } from "@/services/trip/tripService";
import {
  IterationCcw,
  CalendarSync
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/router";

export type TripState = string;
export type TripButtonAction = (tripId: string) => void;

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
    label: "Iniciar viaje",
    Icon: IterationCcw,
    onClick: async (tripId: string) => {
      const response = await startTrip(tripId);

      if (response.state === "ERROR") {
        console.error(response.messages?.[0]);
        return;
      }

    },
  },
  CLOSED: {
    label: "Iniciar viaje",
    Icon: IterationCcw,
    onClick: (tripId) => {},
  },
  FINISHED: {
    label: "Agendar",
    Icon: CalendarSync,
    onClick: (tripId) => {},
  },
};
