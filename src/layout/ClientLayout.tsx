'use client'

import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useEffect, useState } from 'react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <TooltipProvider>
      {isDesktop ? (
        <DesktopLayout>{children}</DesktopLayout>
      ) : (
        <MobileLayout>{children}</MobileLayout>
      )}
    </TooltipProvider>
  )
}
