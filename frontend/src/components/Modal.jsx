// Modal genérico neo-brutalista.
// - Tecla ESC cierra.
// - Click en el overlay (fuera del cuadro) cierra.
// - Bloquea el scroll del body mientras está abierto.
// - El contenido lo pasa el caller via children.

import { useEffect } from 'react'

export function Modal({ abierto, onCerrar, titulo, children, ancho = 'max-w-lg' }) {
  // Bloqueamos el scroll del body cuando el modal está abierto y
  // escuchamos la tecla Escape para cerrar.
  useEffect(() => {
    if (!abierto) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-negro/40 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onCerrar}
    >
      <div
        className={`card !p-0 w-full ${ancho} my-8`}
        // stopPropagation evita que el click dentro del modal cierre el modal.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-3 border-negro px-6 py-4 bg-crema">
          <h2 className="font-display font-bold text-2xl uppercase tracking-tighter">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="font-mono text-xl font-bold hover:text-rojo-faro px-2"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
