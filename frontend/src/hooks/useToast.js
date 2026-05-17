// Hook de conveniencia para invocar Toasts.

import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext.jsx'

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
