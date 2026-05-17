// Router principal. En Fase 4 dejamos placeholders para validar que la
// estructura funciona; en Fase 5 reemplazamos cada elemento por su página real.

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute.jsx'

const Placeholder = ({ titulo, descripcion }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 text-center">
    <span className="badge badge-pendiente">FASE 5 — PENDIENTE</span>
    <h1 className="text-6xl md:text-8xl font-display font-bold uppercase">
      {titulo}
    </h1>
    {descripcion && (
      <p className="font-mono text-sm uppercase tracking-tight max-w-md">
        {descripcion}
      </p>
    )}
  </div>
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Placeholder titulo="Landing" descripcion="Reservas públicas" />} />
        <Route path="/login" element={<Placeholder titulo="Login" />} />
        <Route path="/registro" element={<Placeholder titulo="Registro" />} />

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
              <Placeholder titulo="Servicios" descripcion="Gestión del catálogo" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/empleados"
          element={
            <ProtectedRoute roles={['admin']}>
              <Placeholder titulo="Empleados" descripcion="Equipo de la peluquería" />
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
