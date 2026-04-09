'use client'

import { useAuth } from "@/contexts/authContext";
import { getMyReservations } from "@/services/reservation/reservationService";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReservationResponseDTO } from "../../create/types/dto/reservationResponseDTO";
import { ListFilter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ORDERS_BY = [
  { label: "Más recientes", value: "DATE_DESC" },
  { label: "Más antiguas", value: "DATE_ASC" },
  { label: "Viajes de manera ascendente", value: "TRIP_DATE_ASC" },
  { label: "Viajes de manera descendente", value: "TRIP_DATE_DESC" },
];
export default function MyReservations() {
    const [loading, setLoading] = useState<boolean>(false);
    const [toast, setToast] = useState<{ message: string; type: 'error' | 'warning' } | null>(null);

    const [reservations, setReservations] = useState<ReservationResponseDTO | null>(null)

    const [orderBy, setOrderBy] = useState("DATE_DESC");
    const [fromDate, setFromDate] = useState<string | null>(null);
    const [toDate, setToDate] = useState<string | null>(null);

    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const LIMIT = 10;

    const skipRef = useRef(0);
    const hasMoreRef = useRef(true);
    const { user } = useAuth();


    const loadReservations = useCallback(async (reset = false) => {
        try {
            if (!hasMoreRef.current && !reset) return;
            setLoading(true);

            const currentSkip = reset ? 0 : skipRef.current;

            if (reset) {
                skipRef.current = 0;
                hasMoreRef.current = true;
            }

            const res = await getMyReservations(
                currentSkip, orderBy, fromDate ? new Date(fromDate) : undefined, toDate ? new Date(toDate) : undefined
            );

            const newReservations = res.data?.reservation ?? [];
            const newTotal = res.data?.total ?? 0;

            if (reset) {
                setReservations({ reservation: newReservations, total: newTotal })
            } else {
                setReservations(prev => ({
                    reservation: [...(prev?.reservation ?? []), ...newReservations],
                    total: newTotal,
                }));
            }

            if (newReservations.length < LIMIT) {
                hasMoreRef.current = false;
            } else {
                skipRef.current = currentSkip + LIMIT;
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setToast({ message: error.message, type: 'error' })
            } else {
                setToast({ message: 'Ocurrió un error inesperado', type: 'error' })
            }
        } finally {
            setLoading(false)
        }

        setLoading(false);
    }, [orderBy, fromDate, toDate]);

    useEffect(() => {
        setReservations(null);
        setHasMore(true);
        loadReservations(true);
    }, [orderBy, fromDate, toDate]);

    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loading && hasMore) {
                loadReservations();
            }
        });

        observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [loadReservations, loading, hasMore]);

    return (
        <div className="w-full">
            <div className="flex flex-col gap-3 pb-4">

                {/* Filtro + Orden */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-gray-8 w-fit">
                        <ListFilter size={20} />
                        <p>Filtros</p>
                    </div>

                    <Select
                        value={orderBy}
                        onValueChange={setOrderBy}
                    >
                        <SelectTrigger
                            id="orderBy"
                            className="font-outfit dark:bg-dark-5 flex-1"
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {ORDERS_BY.map((order) => (
                                <SelectItem key={order.value} value={order.value}>
                                    {order.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-3">
                    <div className="flex flex-col text-sm flex-1">
                        <label className="text-gray-11 mb-1">Desde</label>
                        <input
                            type="date"
                            value={fromDate ?? ""}
                            onChange={(e) => setFromDate(e.target.value || null)}
                            max={toDate ?? undefined}
                            className="border border-gray-2 rounded px-2 py-1 h-8"
                        />
                    </div>

                    <div className="flex flex-col text-sm flex-1">
                        <label className="text-gray-11 mb-1">Hasta</label>
                        <input
                            type="date"
                            value={toDate ?? ""}
                            min={fromDate ?? undefined}
                            onChange={(e) => setToDate(e.target.value || null)}
                            className="border border-gray-2 rounded px-2 py-1 h-8"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
