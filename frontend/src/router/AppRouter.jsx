// Router principal de la app.
// Login y Registro ya son páginas reales. Las demás siguen como placeholder
// hasta Fase 6/7.

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute.jsx'
import { useAuth } from '../hooks/useAuth.js'
import Login from '../pages/Login.jsx'
import Registro from '../pages/Registro.jsx'

// Placeholder temporal con info de sesión y botón de logout. Sirve para
// testear el flow de auth mientras las páginas reales (Fase 6/7) aún no están.
const Placeholder = ({ titulo, descripcion }) => {
  const { usuario, logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
      {usuario && (
        <div className="card !p-4 max-w-sm w-full flex items-center justify-between gap-4">
          <div className="text-left">
            <p className="font-mono text-xs uppercase text-negro/60">Sesión activa</p>
            <p className="font-display font-bold uppercase">{usuario.nombre}</p>
            <span className="badge badge-pendiente mt-1">{usuario.rol}</span>
          </div>
          <button onClick={logout} className="btn btn-peligro !px-3 !py-2 text-xs">
            Salir
          </button>
        </div>
      )}
      <span className="badge badge-pendiente">EN CONSTRUCCION</span>
      <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
        {titulo}
      </h1>
      {descripcion && (
        <p className="font-mono text-sm uppercase tracking-tight max-w-md">{descripcion}</p>
      )}
      <Link to="/dashboard" className="font-mono text-xs uppercase underline decoration-2 underline-offset-4 hover:text-azul-faro mt-4">
        ← Volver al dashboard
      </Link>
    </div>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Placeholder titulo="Landing" descripcion="Reservas públicas (próxima fase)" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Placeholder titulo="Dashboard" descripcion="Resumen del negocio" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/turnos"
          element={
            <ProtectedRoute>
              <Placeholder titulo="Turnos" descripcion="Timeline de reservas" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/servicios"
          element={
            <ProtectedRoute roles={['admin']}>
              <Placeholder titulo="Servicios" descripcion="Catálogo" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados"
          element={
            <ProtectedRoute roles={['admin']}>
              <Placeholder titulo="Empleados" descripcion="Equipo" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute roles={['admin', 'empleado']}>
              <Placeholder titulo="Clientes" descripcion="Base de clientes" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Placeholder titulo="Perfil" descripcion="Tus datos" />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Placeholder titulo="404" descripcion="Ruta no encontrada" />} />
      </Routes>
    </BrowserRouter>
  )
}
