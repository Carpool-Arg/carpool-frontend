'use client'

import { X, CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import { LicensePhotoGallery } from "./LicenseGallery";
import { LicenseVerifyDTO } from "../types/licenseVerify";


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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const openGallery = (index: number) => {
    setGalleryInitial(index);
    setGalleryOpen(true);
  };

  const handleSubmit = async () => {
    if (approved === null) return;
    if (!approved && !reason.trim()) {
      setError('Ingresá un motivo de rechazo.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onVerify(driverId, {
        approved,
        rejectionReason: approved ? undefined : reason.trim(),
      });
      onClose();
    } catch {
      setError('Ocurrió un error al verificar la licencia.');
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
                  <img
                    src={url}
                    alt={label}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity "
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
              className="px-4 py-2 cursor-pointer rounded-lg text-sm text-gray-9 hover:text-gray-11 hover:bg-gray-7/40 border border-gray-2/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || loading}
              className="px-4 py-2 cursor-pointer rounded-lg text-sm bg-white text-black font-medium hover:bg-gray-1/90 hover:text-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Confirmar'}
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
    </>
  );
}