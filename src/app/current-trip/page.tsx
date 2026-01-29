'use client'

import { Toast } from "@/components/ux/Toast"
import { useTrip } from "@/contexts/tripContext"
import CurrentTrip from "@/modules/current-trip/components/CurrentTrip"

export default function DriverTripPage() {
  const { errorArrive, clearErrorArrive } = useTrip()

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="max-w-lg w-full relative">
        <CurrentTrip />

        {errorArrive && (
          <Toast
            message={errorArrive}
            type="error"
            onClose={clearErrorArrive}
          />
        )}
      </div>
    </div>
  )
}
