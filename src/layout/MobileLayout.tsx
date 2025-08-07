import MobileNavbar from "@/components/navbar/MobileNavbar";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MobileNavbar />
    </>
  )
}
