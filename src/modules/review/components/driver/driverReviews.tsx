'use client'

import { Toast } from "@/components/ux/Toast";
import { getDriverReviews } from "@/services/review/reviewService";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DriverReviewResponse } from "../../types/DriverReviewResponse";
import { DriverReviewsList } from "./DriverReviewsList";

export default function DriverReviews(){
  const {driverId} = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'warning' } | null>(null);
  const [driverReviews, setDriverReviews] = useState<DriverReviewResponse[] | null>(null)
  const [orderBy, setOrderBy] = useState<"RECENT" | "RATING_ASC" | "RATING_DESC">("RECENT");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const LIMIT = 10;



  const loadReviews = useCallback( async (reset = false) => {
    try{
      setLoading(true)
      if (!driverId || !hasMore && !reset) return;

      const currentSkip = reset ? 0 : skip;

      const reviewsRes = await getDriverReviews(
        Number(driverId),
        currentSkip,
        orderBy
      );

      const newReviews = reviewsRes.data ?? [];

      if (reset) {
        setDriverReviews(newReviews);
      } else {
        setDriverReviews(prev => [...(prev ?? []), ...newReviews]);
      }

      if (newReviews.length < LIMIT) {
        setHasMore(false);
      }else {
        setSkip(prev => prev + LIMIT);
      }

    }catch(error: unknown){
      if (error instanceof Error) {
        setToast({message: error.message, type: 'error'})
      } else {
        setToast({message: 'Ocurrió un error inesperado', type: 'error'})
      }
    }finally{
      setLoading(false)
    }
  },[driverId, skip, orderBy, hasMore]);


  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    loadReviews(true);
  }, [driverId, orderBy]);


  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        loadReviews();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loadReviews, loading, hasMore]);



  if(driverReviews){
    return(
      <div className="w-full">
        <div className="mb-3">
          <h1 className="text-xl font-semibold mb-1">Reseñas del chofer</h1>
          <p className="font-inter text-sm">
            Acá podés las reseñas que otros pasajeros le realizaron a este chofer.
          </p>

        </div>
        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value as any)}
          className="border rounded-md px-3 py-2 text-sm mb-2"
        >
          <option value="RECENT">Más recientes</option>
          <option value="RATING_DESC">Mejor puntuadas</option>
          <option value="RATING_ASC">Peor puntuadas</option>
        </select>

        
        <DriverReviewsList 
          reviews={driverReviews}
        />
        {loading && (
          <p className="text-sm text-gray-500 mt-2">Cargando más reseñas...</p>
        )}

        <div ref={loaderRef} className="h-1" />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    )

  }
}