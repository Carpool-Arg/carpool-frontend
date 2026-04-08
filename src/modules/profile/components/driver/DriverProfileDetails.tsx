'use client'

import { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { capitalizeWords } from "@/shared/utils/string";
import {
  CreditCard,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  IdCard
} from "lucide-react";
import { Rating } from "react-simple-star-rating";
import { LicensePhotoGallery } from "@/modules/admin/licenses/components/LicenseGallery";


const STATUS_CONFIG = {
  PENDING:  { label: 'Pendiente',  icon: Clock,       color: '#f5a623' },
  APPROVED: { label: 'Aprobado',   icon: CheckCircle, color: '#10b37a' },
  REJECTED: { label: 'Rechazado',  icon: XCircle,     color: '#e24b4a' },
} as const;

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function DriverProfileDetails() {
  const { driver } = useAuth();

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  if (!driver) return null;

  const { label, icon: StatusIcon, color } =
    STATUS_CONFIG[driver.licenseStatus];

  return (
    <div className="max-w-lg">
      <div className="rounded-xl border border-gray-7 overflow-hidden ">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-8">
          <div className="flex flex-col">
            <span className="text-sm text-gray-11">
              Licencia de conductor
            </span>
            <span className="text-sm font-medium text-white">
              {capitalizeWords(driver.city)}
            </span>
          </div>
        </div>

        <div className="p-5">

          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gray-9/50 flex items-center justify-center text-2xl font-medium text-white shrink-0">
              {getInitials(driver.fullName)}
            </div>
            <div>
              <p className="text-lg font-medium text-foreground leading-none">
                {driver.fullName}
              </p>
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm pt-1.5">
                  {driver.rating}
                </span>
                <Rating
                  initialValue={driver.rating}
                  fillColor="#c9c9c9"
                  emptyColor="#706562"
                  size={14}
                  readonly
                  SVGstyle={{ display: "inline" }}
                  allowFraction
                />
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="border-t border-gray-7 pt-4 grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <p className="text-sm text-gray-11 mb-0.5">Ciudad</p>
              <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                <MapPin size={14} className="text-gray-1" />
                {capitalizeWords(driver.city)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-11 mb-0.5">Estado</p>
              <p
                className="flex items-center gap-1 text-sm font-medium"
                style={{ color }}
              >
                <StatusIcon size={14} />
                {label}
              </p>
            </div>
          </div>

          {/* License images */}
          <div className="border-t border-gray-7 mt-4 pt-4 flex gap-3">
            {[
              { label: 'Frente', index: 0 },
              { label: 'Dorso',  index: 1 },
            ].map(({ label, index }) => (
              <div
                key={label}
                onClick={() => {
                  setInitialIndex(index);
                  setIsGalleryOpen(true);
                }}
                className="flex-1 bg-gray-9/25 rounded-lg px-3 py-2.5 flex items-center gap-2 hover:bg-gray-9/15 transition-colors cursor-pointer"
              >
                <IdCard size={20} className="text-gray-11 shrink-0" />
                <div>
                  <p className="text-xs text-gray-11 leading-3">
                    {label}
                  </p>
                  <p className="text-sm font-medium">
                    Ver imagen
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Modal Gallery */}
      {isGalleryOpen && (
        <LicensePhotoGallery
          driverName={driver.fullName}
          frontUrl={driver.frontLicenseUrl}
          backUrl={driver.backLicenseUrl}
          initialIndex={initialIndex}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </div>
  );
}