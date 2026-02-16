'use client';

import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  onConfirm: (reason: string) => void;
}

export function CancelReasonModal({ isOpen, onClose, onConfirm,loading = false,  }: Props) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-45">
      <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-xl">
        <h2 className="text-white text-lg font-semibold mb-4">
          Motivo de cancelación
        </h2>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-3 rounded-lg bg-[#252525] text-white resize-none h-40"
          placeholder="Ingresá el motivo de cancelación"
        />

        {/* Warning */}
        <div
        className="
            flex gap-3 items-start
            bg-amber-500/10
            border border-amber-500/30
            rounded-xl p-4 my-6
        "
        >
        <AlertTriangle
            size={18}
            className="text-amber-400 mt-0.5 shrink-0"
        />
        <p className="text-sm text-gray-300 leading-relaxed">
            Al cancelar este viaje, 
            <span className="text-white font-medium">
            las reservas asociadas serán canceladas
            </span> y los pasajeros serán notificados.
            <br/>Te recomendamos cancelar solo si es realmente necesario.
        </p>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Cancelando..." : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}
