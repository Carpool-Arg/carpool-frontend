'use client'

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { useEffect } from "react"

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-success'
      case 'error': return 'bg-error'
      case 'info': return 'bg-blue-500'
      case 'warning': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
      case 'error': return <XCircle className="w-5 h-5 md:w-6 md:h-6" />
      case 'info': return <Info className="w-5 h-5 md:w-6 md:h-6" />
      case 'warning': return <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
      default: return <Info className="w-5 h-5 md:w-6 md:h-6" />
    }
  }

  return (
    <div
      className={`
        fixed
        right-4
        bottom-20 md:bottom-6
        max-w-[90%] md:max-w-sm
        flex items-center gap-3
        px-3 py-2 md:px-4 md:py-3
        rounded-lg shadow-lg text-white
        ${getBgColor()}
        animate-slide-up
      `}
    >
      {getIcon()}
      <span className="text-sm md:text-base font-medium">{message}</span>
    </div>
  )
}
