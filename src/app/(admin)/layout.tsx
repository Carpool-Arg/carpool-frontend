import AdminNavbar from "@/modules/admin/widgets/AdminNavbar"
import AdminSidebar from "@/modules/admin/widgets/AdminSidebar"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-gray-8/20">
      <AdminSidebar />

      <div className="flex flex-col flex-1 min-h-0">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-7 min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}