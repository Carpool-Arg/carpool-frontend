'use client'

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface LicensePhotoGalleryProps {
  driverName: string;
  frontUrl: string;
  backUrl: string;
  initialIndex?: number;
  onClose: () => void;
}

export function LicensePhotoGallery({
  driverName,
  frontUrl,
  backUrl,
  initialIndex = 0,
  onClose,
}: LicensePhotoGalleryProps) {
  const [current, setCurrent] = useState(initialIndex);

  const photos = [
    { label: "Frente", url: frontUrl },
    { label: "Dorso", url: backUrl },
  ];

  const prev = () => setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1));

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#111] border border-white/[0.08] rounded-xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <p className="text-[13px] font-medium text-white/80">{driverName}</p>
            <p className="text-[11px] text-white/30 mt-0.5">
              {photos[current].label} · {current + 1} de {photos.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/[0.06] transition-colors"
          >
            <X size={14} className="text-white/50" />
          </button>
        </div>

        {/* Imagen */}
        <div className="relative bg-[#0d0d0d] flex items-center justify-center" style={{ minHeight: 280 }}>
          <img
            key={current}
            src={photos[current].url}
            alt={photos[current].label}
            className="max-h-[360px] max-w-full object-contain"
          />
          <button
            onClick={prev}
            className="absolute left-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border border-white/[0.08] hover:bg-black/80 transition-colors"
          >
            <ChevronLeft size={15} className="text-white/70" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 border border-white/[0.08] hover:bg-black/80 transition-colors"
          >
            <ChevronRight size={15} className="text-white/70" />
          </button>
        </div>

        {/* Dots / pills */}
        <div className="flex items-center justify-center gap-2 py-4 border-t border-white/[0.06]">
          {photos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] transition-colors border"
              style={{
                background: current === i ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderColor: current === i ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                color: current === i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
              }}
            >
              {photo.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}