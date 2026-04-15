'use client'

import { Toast } from "@/components/ux/Toast"
import { useTrip } from "@/contexts/tripContext"
import CurrentTrip from "@/modules/current-trip/components/CurrentTrip"

export default function DriverTripPage() {
  const { errorArrive, clearErrorArrive } = useTrip()

  return (
    <div className="max-w-lg mx-auto h-full w-full">
      <div className="flex items-end justify-center h-full w-full">

        <CurrentTrip />
      </div>

      {errorArrive && (
        <Toast
          message={errorArrive}
          type="error"
          onClose={clearErrorArrive}
        />
      )}
    </div>

  )
}
