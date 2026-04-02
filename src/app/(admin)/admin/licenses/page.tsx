import { DriversPendingList } from "@/modules/admin/licenses/components/DriversPendingList";



export default function LicensesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-medium text-white/80">Licencias pendientes</h1>
        <p className="text-sm text-white/30">
          Revisá y verificá las licencias de conducir enviadas por los conductores.
        </p>
      </div>

      <DriversPendingList/>
    </div>
  );
}