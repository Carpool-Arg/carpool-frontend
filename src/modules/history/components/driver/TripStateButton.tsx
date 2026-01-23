import {
  IterationCcw,
  CalendarSync
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    onClick: (tripId) => {
      // se define después
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
