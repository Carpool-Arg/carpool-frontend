'use client'

import { X, CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { LicensePhotoGallery } from "./LicenseGallery";
import { LicenseVerifyDTO } from "../types/licenseVerify";
import { AlertDialog } from "@/components/ux/AlertDialog";
import Image from "next/image";

interface LicenseVerifyModalProps {
  driverName: string;
  driverId: number;
  frontUrl: string;
  backUrl: string;
  onClose: () => void;
  onVerify: (driverId: number, data: LicenseVerifyDTO) => Promise<unknown>;
}

export function LicenseVerifyModal({
  driverName,
  driverId,
  frontUrl,
  backUrl,
  onClose,
  onVerify,
}: LicenseVerifyModalProps) {
  const [approved, setApproved] = useState<boolean | null>(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryInitial, setGalleryInitial] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirm = async () => {
    await handleSubmit();
    setIsDialogOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const openGallery = (index: number) => {
    setGalleryInitial(index);
    setGalleryOpen(true);
  };

  const handleSubmit = async (): Promise<boolean> => {
    if (approved === null) return false;

    if (!approved && !reason.trim()) {
      setError('Ingresá un motivo de rechazo.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await onVerify(driverId, {
        approved,
        rejectionReason: approved ? undefined : reason.trim(),
      });

      return true; 
    } catch {
      setError('Ocurrió un error al verificar la licencia.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = approved !== null && (approved || reason.trim().length > 0);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-dark-5 border border-gray-2/40 rounded-xl w-full max-w-md mx-4 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-2/40">
            <div>
              <p className="text-base font-medium text-gray-11">Verificar licencia</p>
              <p className="text-sm text-gray-9">{driverName}</p>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-2/40 transition-colors"
            >
              <X size={14} className="text-gray-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5 flex flex-col gap-4">

            {/* Preview de fotos */}
            <div className="grid grid-cols-2 gap-2">
              {[{ label: 'Frente', url: frontUrl, index: 0 }, { label: 'Dorso', url: backUrl, index: 1 }].map(({ label, url, index }) => (
                <button
                  key={label}
                  onClick={() => openGallery(index)}
                  className="cursor-pointer group relative rounded-lg overflow-hidden border border-gray-2/40 hover:border-gray-2 transition-colors bg-dark-5"
                  style={{ aspectRatio: '16/9' }}
                >
                  <Image
                    src={url}
                    alt={label}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-end p-2">
                    <span className="text-[10px] text-gray-4/80 group-hover:text-gray-4 transition-colors bg-gray-7/80 px-1.5 py-0.5 rounded">
                      {label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Selector aprobar / rechazar */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={loading}
                onClick={() => { setApproved(true); setReason(''); setError(null); }}
                className={`flex items-center justify-center cursor-pointer gap-2 py-3 rounded-lg border text-sm transition-colors ${
                  approved === true
                    ? 'bg-green-800/30 border-green-500/30 text-green-100'
                    : 'border-gray-2/80 text-gray-9 hover:bg-gray-2/40 hover:text-gray-11'
                }`}
              >
                <CircleCheck size={15} />
                Aprobar
              </button>
              <button
                disabled={loading}
                onClick={() => { setApproved(false); setError(null); }}
                className={`flex items-center justify-center cursor-pointer gap-2 py-3 rounded-lg border text-sm transition-colors ${
                  approved === false
                    ? 'bg-red-800/30 border-red-500/30 text-red-100'
                    : 'border-gray-2/80 text-gray-9 hover:bg-gray-2/40 hover:text-gray-11'
                }`}
              >
                <CircleX size={15} />
                Rechazar
              </button>
            </div>

            {/* Motivo de rechazo */}
            {approved === false && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-gray-11">
                  Motivo de rechazo
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setError(null); }}
                  placeholder="Describí el motivo..."
                  rows={3}
                  className="w-full bg-dark-5 border border-gray-2/50 rounded-lg px-3 py-2.5 text-sm text-gray-11 placeholder:text-gray-9 resize-none focus:outline-none focus:border-gray-2 transition-colors"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-[12px] text-red-400/80">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-2/40">
            <button
              onClick={onClose}
              disabled={loading}
              className="disabled:opacity-50 disabled:bg-gray-7 disabled:cursor-not-allowed px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-9 hover:text-gray-11 hover:bg-gray-7/40 border border-gray-2/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => setIsDialogOpen(true)}
              disabled={!canSubmit || loading}
              className="relative overflow-hidden px-4 py-2 cursor-pointer rounded-lg text-sm font-medium border border-gray-2/50 bg-white disabled:cursor-not-allowed transition-all duration-300"
            >
              {/* Fondo animado */}
              <span
                className={`
                  absolute inset-0 transition-all duration-700 ease-out
                  ${loading ? 'w-full animate-pulse' : 'w-0'}
                  ${approved === true ? 'shadow-[0_0_12px_rgba(22,163,74,0.5)]' : ''}
                  ${approved === false ? 'shadow-[0_0_12px_rgba(239,68,68,0.5)]' : ''}
                `}
                style={{
                  width: loading ? '100%' : '0%',
                  background:
                    approved === true
                      ? 'linear-gradient(to right, #16a34a, #15803d)'
                      : approved === false
                      ? 'linear-gradient(to right, #ef4444, #dc2626)'
                      : 'transparent',
                }}
              />

              {/* Texto */}
              <span
                className={`
                  relative z-10 transition-colors duration-300
                  ${loading ? 'text-white' : 'text-black'}
                `}
              >
                {loading
                  ? approved === true
                    ? 'Aprobando...'
                    : 'Rechazando...'
                  : 'Confirmar'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Galería encima del modal */}
      {galleryOpen && (
        <LicensePhotoGallery
          driverName={driverName}
          frontUrl={frontUrl}
          backUrl={backUrl}
          initialIndex={galleryInitial}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {isDialogOpen &&
        <AlertDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleConfirm}
          type="info"
          title="Confirmar verificación"
          description={
            approved
              ? 'Vas a aprobar esta licencia. Esta acción es definitiva y no se puede revertir.'
              : 'Vas a rechazar esta licencia. Esta acción es definitiva y no se puede revertir.'
          }
          confirmText="Confirmar"
          cancelText="Cancelar"
        />
      }
      
    </>
  );
}