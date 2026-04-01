import AdminNavbar from "@/modules/admin/AdminNavbar"
import AdminSidebar from "@/modules/admin/AdminSidebar"


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-950">
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