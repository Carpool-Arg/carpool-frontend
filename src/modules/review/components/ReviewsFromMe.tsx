'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toast } from "@/components/ux/Toast";
import { getReviewsFromMe } from "@/services/review/reviewService";
import { ListFilter } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ReviewsFromMeResponse } from "../types/ReviewsFromMeResponse";
import { ReviewsFromMeList } from "./ReviewsFromMeList";
import RoleSelectorHeader from "@/components/ux/RoleSelectorHeader";


export const ORDERS_BY = [
  { label: "Más recientes", value: "RECENT" },
  { label: "Mejor puntuadas", value: "RATING_DESC" },
  { label: "Peor puntuadas", value: "RATING_ASC" },
];
export default function ReviewsFromMe(){
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'warning' } | null>(null);
  const [reviewsFromMe, setReviewsFromMe] = useState<ReviewsFromMeResponse | null>(null)
  const [orderBy, setOrderBy] = useState("RECENT");
  const [role, setRole]=useState('passenger');
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  
  
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const LIMIT = 10;

  const skipRef = useRef(0);
  const hasMoreRef = useRef(true);

  const handleChangeRole = (value: string) => {
    setRole(value);
  };


  const loadReviews = useCallback(async (reset = false) => {
  if (!hasMoreRef.current && !reset) return;
  setLoading(true);

  const currentSkip = reset ? 0 : skipRef.current;

  if (reset) {
    skipRef.current = 0;
    hasMoreRef.current = true;
  }

  const reviewsRes = await getReviewsFromMe(
    role, currentSkip, orderBy, fromDate ? new Date(fromDate) : undefined, toDate ? new Date(toDate) : undefined
  );

    const newReviews = reviewsRes.data?.reviews ?? [];

    if (reset) {
      setReviewsFromMe({ reviews: newReviews });
    } else {
      setReviewsFromMe(prev => ({
        reviews: [...(prev?.reviews ?? []), ...newReviews]
      }));
    }

    if (newReviews.length < LIMIT) {
      hasMoreRef.current = false;
    } else {
      skipRef.current = currentSkip + LIMIT;
    }

    setLoading(false);
  }, [role, orderBy, fromDate, toDate]);


  useEffect(() => {
    setSkip(0);
    setReviewsFromMe(null); 
    setHasMore(true);
    loadReviews(true);
  }, [orderBy,role, fromDate, toDate]);


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



  
  return(
    <div className="w-full">
      <RoleSelectorHeader
        title="Listado de reseñas"
        description="Aca podés ver las reseñas que realizaste a pasajeros y choferes"
        role={role}
        onChangeRole={handleChangeRole}
      />
      <div className="flex items-center w-1/2 gap-2 pb-4">
        <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-gray-8">
          <ListFilter size={20}/>
          <p>Filtro</p>
        </div>

        <Select
          value={orderBy}
          onValueChange={setOrderBy}
        >
          <SelectTrigger
            id="orderBy"
            className="font-outfit dark:bg-dark-5"
          >
            <SelectValue/>
          </SelectTrigger>

          <SelectContent>
            {ORDERS_BY.map((order) => (
              <SelectItem key={order.value} value={order.value}>
                {order.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <input
            type="date"
            value={fromDate ?? ""}
            onChange={(e) => setFromDate(e.target.value || null)}
            className="border rounded px-2 py-1"
          />

          <input
            type="date"
            value={toDate ?? ""}
            onChange={(e) => setToDate(e.target.value || null)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      <ReviewsFromMeList reviews={reviewsFromMe?.reviews ?? []} />



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
