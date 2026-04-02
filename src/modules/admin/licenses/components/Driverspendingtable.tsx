'use client'

import React, { useState } from "react";
import { User, Eye, FileSearchCorner } from "lucide-react";
import { LicensePhotoGallery } from "./Licensephotogallery";
import { DriverPendingDTO } from "../types/driverPending";
import { LicenseVerifyDTO } from "../types/licenseVerify";
import { LicenseVerifyModal } from "./Licenseverifymodal";


interface DriversPendingTableProps {
  drivers: DriverPendingDTO[];
  onVerify: (driverId: number, data: LicenseVerifyDTO) => Promise<unknown>;
}

export function DriversPendingTable({ drivers, onVerify }: DriversPendingTableProps) {
  const [selectedGallery, setSelectedGallery] = useState<DriverPendingDTO | null>(null);
  const [selectedVerify, setSelectedVerify] = useState<DriverPendingDTO | null>(null);

  return (
    <>
      <div className="rounded-lg border border-gray-2/80 overflow-hidden">
        <table className="min-w-full text-[13px]">
          <thead>
            <tr className="bg-gray-2/50 border-b border-gray-2/80">
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-11 uppercase tracking-widest">Nombre</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-11 uppercase tracking-widest">Email</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-11 uppercase tracking-widest">Teléfono</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-11 uppercase tracking-widest">Clase</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-11 uppercase tracking-widest">Vencimiento</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-11 uppercase tracking-widest">Estado</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-11 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr
                key={driver.driverId}
                className={`border-b border-gray-7 hover:bg-gray-8 transition-colors ${
                  index === drivers.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <td className="px-5 py-3 text-gray-11 font-medium">
                  <div className="flex items-center gap-1.5">
                    <User size={14} fill="currentColor" />
                    {driver.fullName}
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-11/80">{driver.email}</td>
                <td className="px-5 py-3 text-gray-11/80">{driver.phone}</td>
                <td className="px-5 py-3 text-gray-11/80">{driver.licenseClass}</td>
                <td className="px-5 py-3 text-gray-11/80">{driver.licenseExpirationDate}</td>
                <td className="px-5 py-3">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] bg-white/6 text-gray-11/80 border border-white/8">
                    {driver.licenseStatus}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedGallery(driver)}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-white/8 hover:bg-white/6 hover:border-white/15 transition-colors group"
                      title="Ver fotos de licencia"
                    >
                      <Eye size={14} className="text-white/40 group-hover:text-white/70 transition-colors" />
                    </button>
                    <button
                      onClick={() => setSelectedVerify(driver)}
                      className="w-7 h-7 flex items-center justify-center rounded-md border border-white/8 hover:bg-white/6 hover:border-white/15 transition-colors group"
                      title="Verificar licencia"
                    >
                      <FileSearchCorner size={14} className="text-white/40 group-hover:text-white/70 transition-colors" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedGallery && (
        <LicensePhotoGallery
          driverName={selectedGallery.fullName}
          frontUrl={selectedGallery.frontLicensePhotoUrl}
          backUrl={selectedGallery.backLicensePhotoUrl}
          onClose={() => setSelectedGallery(null)}
        />
      )}

      {selectedVerify && (
        <LicenseVerifyModal
          driverName={selectedVerify.fullName}
          driverId={selectedVerify.driverId}
          frontUrl={selectedVerify.frontLicensePhotoUrl}
          backUrl={selectedVerify.backLicensePhotoUrl}
          onClose={() => setSelectedVerify(null)}
          onVerify={onVerify}
        />
      )}
    </>
  );
}