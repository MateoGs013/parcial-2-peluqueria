// Página 404 con layout propio (no usa LayoutAutenticado para que sea
// accesible sin sesión también). Mantiene la onda neo-brutalista con un
// "404" tipográfico gigante en los colores del faro.

import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function NotFound() {
  const { usuario } = useAuth()
  return (
    <div className="min-h-screen bg-crema flex flex-col">
      <header className="px-4 lg:px-8 py-3 border-b-3 border-negro">
        <Link
          to="/"
          className="font-display font-bold text-lg lg:text-xl uppercase tracking-tighter"
        >
          <span className="text-rojo-faro">✂</span> Peluquería
          <span className="text-azul-faro"> SaaS</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <p className="font-display font-bold leading-none tracking-tighter text-[28vw] lg:text-[14rem]">
            <span className="text-rojo-faro">4</span>
            <span className="text-azul-faro">0</span>
            <span>4</span>
          </p>
          <p className="font-display font-bold text-2xl md:text-4xl uppercase tracking-tighter mt-4">
            Esta página no existe.
          </p>
          <p className="font-mono text-sm uppercase mt-3 tracking-tight text-negro/70">
            La ruta que pediste no está en el mapa.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mt-8">
            <Link to="/" className="btn btn-primario">
              Volver al inicio
            </Link>
            {usuario && (
              <Link to="/dashboard" className="btn btn-secundario">
                Ir al panel
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
