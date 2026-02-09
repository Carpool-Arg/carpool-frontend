'use client'
import { Button } from "@/components/ux/Button";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";

export default function NewDriverReview(){
  const { tripId } = useParams();
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false)


  const handleRating = (rate: number) => {
    const stars = rate;
    setRating(stars);
  };


  const sendReview = async () => {
    setLoading(true)
    const payload = {
      tripId,
      rating, // 1 a 5
    };

    console.log(payload);
  };

  const getRatingText = (rating: number) => {
    if (rating === 1) return "Muy malo";
    if (rating === 2) return "Malo";
    if (rating === 3) return "Regular";
    if (rating === 4) return "Bueno";
    if (rating === 5) return "Excelente";
    return "Seleccioná una calificación";
  };
  return(
    <div className="flex flex-col">
      <Rating
        onClick={handleRating}
        fillColor="#ffffff"
        emptyColor="#706562"
        size={40}
        SVGstyle={{ display: "inline" }}
      />

      <span className="text-lg font-medium">
        {getRatingText(rating)}
      </span>

        <Button
            onClick={sendReview}
            variant="primary"
            className="disabled:opacity-50"
            disabled={loading}
          >
          {loading ? (
            <div className="px-6 py-0.5 flex justify-center">
              <div className=" h-4 w-4 animate-spin rounded-full border-2 border-gray-2 border-t-transparent"></div>
            </div>
          ) : (
            "Reseñar"
          )}
        </Button>
    </div>
  )
}