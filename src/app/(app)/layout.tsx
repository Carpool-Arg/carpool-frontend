'use client'

import ClientLayout from "@/layout/ClientLayout"
import ServiceWorkerRegistration from '@/SWRegister'
import { UnpaidPaymentModal } from "@/components/alerts/UnpaidPaymentModal"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>
      <ServiceWorkerRegistration />
        {children}
      <UnpaidPaymentModal />
    </ClientLayout>
  )
}