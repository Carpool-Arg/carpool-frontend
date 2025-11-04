'use client'

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react"
import { useEffect } from "react"

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number // en ms
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
      case 'success': return <CheckCircle/>
      case 'error': return <XCircle/>
      case 'info': return <Info/>
      case 'warning': return <AlertTriangle/>
      default: return <Info/>
    }
  }

  return (
    <div
      className={`fixed bottom-16 md:bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${getBgColor()}`}
    >
      {getIcon()}
      <span>{message}</span>
    </div>
  )
}
