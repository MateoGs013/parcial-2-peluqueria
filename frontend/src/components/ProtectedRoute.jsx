// Wrapper para rutas privadas.
// - Si todavía está cargando la sesión, muestra un placeholder (evita
//   redirigir a /login en lo que rehidrata el usuario al recargar).
// - Si no hay usuario, redirige a /login y guarda la ruta de origen en
//   location.state para volver después del login.
// - Si se pasan "roles", también valida que el usuario tenga uno de esos.

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export function ProtectedRoute({ children, roles = null }) {
  const { usuario, cargando } = useAuth()
  const location = useLocation()

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono uppercase tracking-tight">Cargando...</p>
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }

  return children
}
