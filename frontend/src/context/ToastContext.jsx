// Context global para los Toasts (notificaciones efímeras).
// Cualquier componente puede invocar useToast().exito/error/info para
// mostrar un cartel en bottom-right que se auto-cierra en 3.5s.

import { createContext, useState, useCallback } from 'react'

export const ToastContext = createContext(null)

let proximoId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const cerrar = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  // useCallback con [cerrar] para no re-crear la función en cada render.
  const agregar = useCallback(
    (mensaje, tipo) => {
      const id = ++proximoId
      setToasts((prev) => [...prev, { id, mensaje, tipo }])
      setTimeout(() => cerrar(id), 3500)
    },
    [cerrar]
  )

  const valor = {
    exito: (m) => agregar(m, 'exito'),
    error: (m) => agregar(m, 'error'),
    info: (m) => agregar(m, 'info'),
  }

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <ContenedorToasts toasts={toasts} onCerrar={cerrar} />
    </ToastContext.Provider>
  )
}

function ContenedorToasts({ toasts, onCerrar }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} mensaje={t.mensaje} tipo={t.tipo} onCerrar={() => onCerrar(t.id)} />
      ))}
    </div>
  )
}

function Toast({ mensaje, tipo, onCerrar }) {
  const clases = {
    exito: 'bg-azul-faro text-white',
    error: 'bg-rojo-faro text-white',
    info: 'bg-crema text-negro',
  }
  return (
    <div
      className={`${clases[tipo] || clases.info} border-3 border-negro shadow-bruta px-4 py-3 flex items-start gap-3 pointer-events-auto animate-deslizar`}
    >
      <p className="font-mono text-sm uppercase flex-1 tracking-tight leading-tight">
        {mensaje}
      </p>
      <button
        onClick={onCerrar}
        className="font-mono text-lg leading-none hover:scale-110 transition-transform"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  )
}
