import { TripPriceSummarySkeleton } from "./TripPriceSummarySkeleton";

interface TripPriceSummaryProps {
  publishedSeatPrice: number;
  driverPriceDiscount: number;
  netEarningsPerSeat: number;
  loading?: boolean;
}

export function TripPriceSummary({
  publishedSeatPrice,
  driverPriceDiscount,
  netEarningsPerSeat,
  loading = false,
}: TripPriceSummaryProps) {
  if (loading) {
    return <TripPriceSummarySkeleton />;
  }

  return (
    <div className="rounded-lg border border-gray-5/40 dark:border-gray-2/40
                    bg-gray-1/30 dark:bg-gray-2/10 p-4">
      <h4 className="text-sm font-medium mb-3">
        Resumen del precio
      </h4>

      <div className="space-y-1 text-sm text-gray-4">
        <div className="flex justify-between">
          <span>Precio publicado</span>
          <span>${publishedSeatPrice.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Comisión de la plataforma</span>
          <span className="text-red-400">
            -${driverPriceDiscount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between font-medium text-gray-7 dark:text-gray-1
                        pt-2 border-t border-gray-5/30">
          <span>Total a recibir por pasajero</span>
          <span>${netEarningsPerSeat.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
