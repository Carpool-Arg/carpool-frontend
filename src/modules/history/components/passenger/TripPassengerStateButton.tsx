import { CalendarSync, IterationCcw, LucideEye, LucideIcon } from "lucide-react";
import { TripActionResult } from "../../types/TripActionResult";
import { TripState } from "../driver/TripDriverStateButton";
import { startTrip } from "@/services/trip/tripService";

export type TripActionScope = "view" | "start" | "edit";

export type TripButtonAction = (
  tripId: string,
  scope: TripActionScope
) => Promise<TripActionResult>;

export type TripButtonConfig = {
  label: string;
  Icon: LucideIcon;
  className?: string;
  disabled?: boolean;
  onClick: TripButtonAction;
  secondaryActions?: {
    label: string;
    Icon: LucideIcon;
    className?: string;
    onClick: TripButtonAction;
  }[];
};

export const tripButtonConfig: Record<TripState, TripButtonConfig> = {
  CREATED: {
    label: "Visualizar",
    Icon: LucideEye,
    onClick: async (_, scope) => {
      if (scope === "view") {
        return { ok: true };
      }

      return { ok: false, message: "Acción no permitida" };
    },
  },

  CLOSED: {
    label: "Iniciar viaje",
    Icon: IterationCcw,
    onClick: async (tripId, scope) => {
      if (scope === "start") {
        const response = await startTrip(tripId);

        if (response.state === "ERROR") {
          return {
            ok: false,
            message: response.messages?.[0] ?? "Error al iniciar el viaje",
          };
        }

        return { ok: true };
      }

      if (scope === "view") {
        return { ok: true };
      }

      return { ok: false, message: "Acción no permitida" };
    },
  },


  FINISHED: {
    label: "Agendar",
    Icon: CalendarSync,
    onClick: async (_, scope) => {
      if (scope === "view") {
        return { ok: true };
      }

      return { ok: false, message: "Acción no permitida" };
    },
  },
};