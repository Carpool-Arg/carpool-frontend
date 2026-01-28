"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { arriveTripStop, getCurrentTrip } from "@/services/trip/tripService"
import { CurrentTripDTO } from "@/modules/current-trip/types/currentTrip"
import { useAuth } from "./authContext"


type TripContextType = {
  tripActive: boolean
  currentTrip: CurrentTripDTO | null
  loading: boolean
  arriveLoading: boolean
  errorArrive:string | null
  clearErrorArrive: () => void
  arriveNextStop: () => Promise<void>
  refetchCurrentTrip: () => Promise<void>
}

const TripContext = createContext<TripContextType | undefined>(undefined)

const TRIP_ROUTE = "/current-trip"

export function TripProvider({ children }: { children: ReactNode }) {
  const [currentTrip, setCurrentTrip] = useState<CurrentTripDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [arriveLoading, setArriveLoading] = useState(false)
  const [errorArrive, setErrorArrive] = useState<string | null>(null)
  const clearErrorArrive = () => setErrorArrive(null)
  const router = useRouter()
  const pathname = usePathname()

  const tripActive = !!currentTrip
  const { user, loading: authLoading } = useAuth()
  
  useEffect(() => {
    if (authLoading) return
    if (!user) return

    fetchTrip()
  }, [user, authLoading])

  useEffect(() => {
    if (loading) return
    if (authLoading) return
    if (!user) return

    if (!currentTrip && pathname === TRIP_ROUTE) {
      router.replace('/home')
    }
  }, [currentTrip, loading, authLoading, user, pathname])

  
  const fetchTrip = async () => {
    try {
      const res = await getCurrentTrip()

      if (res.state === "OK" && res.data) {
        setCurrentTrip(res.data)

        if (pathname !== TRIP_ROUTE) {
          router.replace(TRIP_ROUTE)
        }
      } else {
        setCurrentTrip(null)
      }
    } catch (e) {
      console.error("Error fetching trip", e)
      setCurrentTrip(null)
    } finally {
      setLoading(false)
    }
  }


  const refetchCurrentTrip = async () => {
    const response = await getCurrentTrip();
    if (response.state === "OK") {
      setCurrentTrip(response.data);
    }
  };

  const arriveNextStop = async () => {
    if (!currentTrip) return
    setArriveLoading(true)
    
    const nextStop = currentTrip.tripStops.find(
      stop => !stop.arrivalDateTime
    )

    const res = await arriveTripStop(String(nextStop?.tripstopId) ?? "" )

    if (res.state !== "OK") {
      setArriveLoading(false)
      setErrorArrive(res?.messages[0] ?? 'Ocurrió un error inesperado.')
      return
    }

    const isLastStop = nextStop?.tripStop.destination === true

    if (isLastStop) {
      setCurrentTrip(null)
      setArriveLoading(false)
      setTimeout(() => router.push('/home'), 2000)
      return
    }

    await fetchTrip()
    
    setCurrentTrip(prev => {
      if (!prev) return prev
      setArriveLoading(false)
      return {
        ...prev,
        tripStops: prev.tripStops.map(ts =>
          ts.tripstopId === nextStop?.tripstopId
            ? {
                ...ts,
                tripStop: {
                  ...ts.tripStop,
                  arrived: true,
                },
              }
            : ts
        ),
      }
    })
  }


  return (
    <TripContext.Provider
      value={{
        tripActive,
        currentTrip,
        loading,
        arriveLoading,
        errorArrive,
        arriveNextStop,
        clearErrorArrive,
        refetchCurrentTrip
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) {
    throw new Error("useTrip debe usarse dentro de TripProvider")
  }
  return ctx
}
