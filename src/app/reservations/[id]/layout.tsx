'use client';

import { Tab } from "@/components/ux/Tab";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = searchParams.get("state") ?? "PENDING";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("state", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center md:mt-8">
      <div className="w-lg max-w-3xl px-4">
        {/* HEADER */}
        <div className="mb-3">
          <h1 className="text-xl font-semibold">Solicitudes de reserva</h1>
        </div>

        
        <Tab value={state} onChange={handleChange} />
        

        {children}
      </div>
    </div>
  );

}
