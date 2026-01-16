import {
  IterationCcw,
  Square,
  Check,
  CalendarSync
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TripState = string;

export const tripButtonConfig: Record<
  TripState,
  {
    label: string;
    Icon: LucideIcon;
    className?: string;
    disabled?: boolean;
  }
> = {
  CREATED: {
    label: "Iniciar viaje",
    Icon: IterationCcw,
  },
  CLOSED: {
    label: "Iniciar viaje",
    Icon: IterationCcw,
  },
  FINISHED: {
    label: "Agendar",
    Icon: CalendarSync,
  },
};
