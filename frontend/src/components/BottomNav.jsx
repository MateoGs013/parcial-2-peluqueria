// Bottom navigation tipo "tab bar" para mobile.
// Se oculta en desktop (lg+) — ahí usamos el nav horizontal del header.
//
// La estructura cambia según el rol:
// - Cliente / Empleado: 4 items fijos.
// - Admin: 4 items principales + botón "Más" que abre un sheet con el resto.

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { Modal } from './Modal.jsx'

// Items siempre visibles en el bottom nav, en orden.
const ITEMS_VISIBLES = {
  admin: [
    { to: '/dashboard', label: 'Inicio', icono: '◆' },
    { to: '/turnos', label: 'Turnos', icono: '✂' },
    { to: '/servicios', label: 'Catálogo', icono: '⚙' },
    { to: '/clientes', label: 'Clientes', icono: '◊' },
  ],
  empleado: [
    { to: '/dashboard', label: 'Inicio', icono: '◆' },
    { to: '/turnos', label: 'Turnos', icono: '✂' },
    { to: '/clientes', label: 'Clientes', icono: '◊' },
    { to: '/perfil', label: 'Perfil', icono: '◉' },
  ],
  cliente: [
    { to: '/dashboard', label: 'Inicio', icono: '◆' },
    { to: '/reservar', label: 'Reservar', icono: '+' },
    { to: '/turnos', label: 'Mis turnos', icono: '✂' },
    { to: '/perfil', label: 'Perfil', icono: '◉' },
  ],
}

// Items extras que se muestran en el sheet "Más" para roles que tienen
// más de 4 secciones. Para empleado/cliente no hay extras.
const ITEMS_EXTRA = {
  admin: [
    { to: '/empleados', label: 'Empleados', icono: '★' },
    { to: '/usuarios', label: 'Usuarios', icono: '⊕' },
    { to: '/perfil', label: 'Perfil', icono: '◉' },
  ],
  empleado: [],
  cliente: [],
}

export function BottomNav() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [masAbierto, setMasAbierto] = useState(false)

  if (!usuario) return null

  const principales = ITEMS_VISIBLES[usuario.rol] || []
  const extras = ITEMS_EXTRA[usuario.rol] || []
  const tieneMas = extras.length > 0
  const columnas = tieneMas ? 'grid-cols-5' : 'grid-cols-4'

  const irY = (ruta) => {
    setMasAbierto(false)
    navigate(ruta)
  }

  const onLogout = () => {
    setMasAbierto(false)
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-crema border-t-3 border-negro">
        <ul className={`grid ${columnas}`}>
          {principales.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 py-2 px-1 text-center transition-colors ${
                    isActive ? 'bg-negro text-white' : 'text-negro hover:bg-white'
                  }`
                }
              >
                <span className="font-display font-bold text-2xl leading-none">
                  {item.icono}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-tight leading-none">
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
          {tieneMas && (
            <li>
              <button
                type="button"
                onClick={() => setMasAbierto(true)}
                className="w-full h-full flex flex-col items-center justify-center gap-1 py-2 px-1 text-center hover:bg-white"
              >
                <span className="font-display font-bold text-2xl leading-none">≡</span>
                <span className="font-mono text-[9px] uppercase tracking-tight leading-none">
                  Más
                </span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Sheet "Más" — modal estándar pero con look de drawer en mobile. */}
      <Modal abierto={masAbierto} onCerrar={() => setMasAbierto(false)} titulo="Más">
        <ul className="space-y-2">
          {extras.map((item) => (
            <li key={item.to}>
              <button
                onClick={() => irY(item.to)}
                className="w-full text-left border-3 border-negro bg-white shadow-bruta px-4 py-3 flex items-center gap-3 hover:shadow-bruta-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <span className="font-display font-bold text-2xl leading-none">
                  {item.icono}
                </span>
                <span className="font-display font-bold uppercase tracking-tight">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
          <li className="pt-2 border-t-2 border-negro">
            <button
              onClick={onLogout}
              className="btn btn-peligro w-full justify-center"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </Modal>
    </>
  )
}
