import HeaderPage from "@/components/ux/admin/HeaderPage";
import Dashboard from "@/modules/admin/dashboard/components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <HeaderPage
        title="Dashboard" 
        desc=""
      />

      <Dashboard/>
    </div>
  );
}