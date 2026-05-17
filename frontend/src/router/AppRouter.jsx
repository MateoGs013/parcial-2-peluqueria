// Router principal de la app.
// Las rutas autenticadas comparten LayoutAutenticado (header + outlet).

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute.jsx'
import { LayoutAutenticado } from '../layouts/LayoutAutenticado.jsx'
import Login from '../pages/Login.jsx'
import Registro from '../pages/Registro.jsx'
import Servicios from '../pages/Servicios.jsx'
import Empleados from '../pages/Empleados.jsx'
import Clientes from '../pages/Clientes.jsx'
import Turnos from '../pages/Turnos.jsx'

const Placeholder = ({ titulo, descripcion }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
    <span className="badge badge-pendiente">EN CONSTRUCCION</span>
    <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
      {titulo}
    </h1>
    {descripcion && (
      <p className="font-mono text-sm uppercase tracking-tight max-w-md">{descripcion}</p>
    )}
    <Link
      to="/dashboard"
      className="font-mono text-xs uppercase underline decoration-2 underline-offset-4 hover:text-azul-faro mt-4"
    >
      ← Volver al dashboard
    </Link>
  </div>
)

const LandingPlaceholder = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center bg-crema">
    <span className="badge badge-pendiente">EN CONSTRUCCION</span>
    <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
      Landing.
    </h1>
    <p className="font-mono text-sm uppercase">Reservas públicas (próxima fase)</p>
    <div className="flex gap-3 mt-4">
      <Link to="/login" className="btn btn-primario">
        Iniciar sesión
      </Link>
      <Link to="/registro" className="btn btn-peligro">
        Registrarme
      </Link>
    </div>
  </div>
)

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPlaceholder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas — comparten el LayoutAutenticado */}
        <Route
          element={
            <ProtectedRoute>
              <LayoutAutenticado />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Placeholder titulo="Dashboard" descripcion="Resumen del negocio" />} />
          <Route path="/turnos" element={<Turnos />} />
          <Route path="/perfil" element={<Placeholder titulo="Perfil" descripcion="Tus datos" />} />
        </Route>

        {/* Solo admin */}
        <Route
          element={
            <ProtectedRoute roles={['admin']}>
              <LayoutAutenticado />
            </ProtectedRoute>
          }
        >
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/empleados" element={<Empleados />} />
        </Route>

        {/* Admin o empleado */}
        <Route
          element={
            <ProtectedRoute roles={['admin', 'empleado']}>
              <LayoutAutenticado />
            </ProtectedRoute>
          }
        >
          <Route path="/clientes" element={<Clientes />} />
        </Route>

        <Route path="*" element={<Placeholder titulo="404" descripcion="Ruta no encontrada" />} />
      </Routes>
    </BrowserRouter>
  )
}
