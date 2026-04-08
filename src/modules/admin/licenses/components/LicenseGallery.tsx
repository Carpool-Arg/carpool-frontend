'use client'

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
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
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-dark-5/80 border border-gray-2/40 rounded-xl w-full max-w-lg mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-2/40">
          <div>
            <p className="text-base font-medium text-gray-11">{driverName}</p>
            <p className="text-sm text-white/30">
              {photos[current].label} · {current + 1} de {photos.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-2/50 cursor-pointer transition-colors"
          >
            <X size={14} className="text-white/50" />
          </button>
        </div>

        {/* Imagen */}
        <div className="relative bg-dark-5 flex items-center justify-center" style={{ minHeight: 280 }}>
          <Image
            key={current}
            src={photos[current].url}
            alt={photos[current].label}
            className="max-h-90 max-w-full object-contain"
          />
          <button
            onClick={prev}
            className="absolute left-3 w-8 h-8 flex items-center justify-center rounded-full bg-dark-5/80 border border-gray-2/40 hover:bg-black/90 transition-colors cursor-pointer"
          >
            <ChevronLeft size={15} className="text-gray-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 w-8 h-8 flex items-center justify-center rounded-full bg-dark-5/80 border border-gray-2/40 hover:bg-black/90 transition-colors cursor-pointer"
          >
            <ChevronRight size={15} className="text-gray-4" />
          </button>
        </div>

        {/* Dots / pills */}
        <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-2/40">
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