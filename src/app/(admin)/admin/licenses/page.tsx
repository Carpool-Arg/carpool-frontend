import HeaderPage from "@/components/ux/admin/HeaderPage";
import { DriversPendingList } from "@/modules/admin/licenses/components/Driverspendinglist";



export default function LicensesPage() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderPage 
        title="Licencias pendientes" 
        desc="Revisá y verificá las licencias de conducir enviadas por los conductores."
      />

      <DriversPendingList/>
    </div>
  );
}