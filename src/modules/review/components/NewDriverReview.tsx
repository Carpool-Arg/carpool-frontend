'use client'

import { Button } from "@/components/ux/Button";
import { useParams, useRouter } from "next/navigation";
import { Rating } from "react-simple-star-rating";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DriverReviewForm, driverReviewSchema } from "../schemas/driverReviewSchema";
import { ReviewRequestDTO } from "../types/dto/ReviewRequestDTO";
import { createReview } from "@/services/review/reviewService";
import { Toast } from "@/components/ux/Toast";
import { AlertDialog } from "@/components/ux/AlertDialog";


export default function NewDriverReview() {
  const { tripId } = useParams();
  const [rating, setRating] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DriverReviewForm>({
    resolver: zodResolver(driverReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const handleRating = (rate: number) => {
    setRating(rate);
    setValue("rating", rate, { shouldValidate: true });
  };

  const onSubmit = async (data: DriverReviewForm) => {
    const payload: ReviewRequestDTO = {
      stars: data.rating,
      description: data.comment,
      tripId: Number(tripId),
    };
    setLoading(true)

    try {
      const response = await createReview(payload);

      if (response.state != 'OK') {
        setToast({ message: response.messages[0] ?? 'Error al crear la reseña', type: 'error' });
        return
      }

      setLoading(false)
      setIsSuccessDialogOpen(true)
    } catch (error: unknown) {
      setLoading(false);
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      setToast({ message, type: 'error' });
    }


  };

  const commentValue = watch("comment") || "";

  const getRatingText = (rating: number) => {
    if (rating === 1) return "Muy malo";
    if (rating === 2) return "Malo";
    if (rating === 3) return "Regular";
    if (rating === 4) return "Bueno";
    if (rating === 5) return "Excelente";
    return "Seleccioná una calificación";
  };

  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {/* Rating */}
      <div className="flex flex-col gap-1">
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

        {errors.rating && (
          <span className="text-sm text-red-500">
            {errors.rating.message}
          </span>
        )}
      </div>

      {/* Comentario */}
      <div className="flex flex-col gap-1">
        <textarea
          {...register("comment")}
          rows={4}
          placeholder="Dejá tu reseña..."
          className={`
            w-full rounded-xl border bg-gray-2 p-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary
            ${errors.comment ? "border-red-500" : "border-gray-5"}
          `}
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>{commentValue.length}/300</span>
          {errors.comment && (
            <span className="text-red-500">
              {errors.comment.message}
            </span>
          )}
        </div>
      </div>

      {/* Botón */}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting}
        className="disabled:opacity-50"
      >
        {isSubmitting ? (
          <div className="px-6 py-0.5 flex justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-2 border-t-transparent" />
          </div>
        ) : (
          "Reseñar"
        )}
      </Button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AlertDialog
        isOpen={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        type="success"
        title="¡Reseña enviada con éxito!"
        description='Gracias por tomarte el tiempo de calificar al chofer. Tu comentario ayuda a que los viajes sean cada vez mejores'
        confirmText="Aceptar"
        singleButton={true}
        onConfirm={()=> router.push('/home')}
      />
    </form>


  );
}
