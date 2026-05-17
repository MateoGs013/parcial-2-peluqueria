// Página de Usuarios (admin-only).
// Layout: tabla brutalista — el único layout que faltaba en la app
// (los demás son grid, lista con franja, sticker, agenda).

import { useState } from 'react'
import {
  listarUsuariosAPI,
  crearUsuarioAPI,
  actualizarUsuarioAPI,
  eliminarUsuarioAPI,
} from '../api/usuarios.api.js'
import { useFetch } from '../hooks/useFetch.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { Modal } from '../components/Modal.jsx'
import { ModalConfirmacion } from '../components/ModalConfirmacion.jsx'

const COLORES_ROL = {
  admin: 'bg-negro text-white',
  empleado: 'bg-azul-faro text-white',
  cliente: 'bg-crema text-negro',
}

export default function Usuarios() {
  const { usuario: yo } = useAuth()
  const toast = useToast()
  const { datos: usuarios, cargando, error, recargar } = useFetch(() => listarUsuariosAPI())

  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [pidiendoEliminar, setPidiendoEliminar] = useState(null)

  const abrirNuevo = () => {
    setEditando(null)
    setModalAbierto(true)
  }
  const abrirEditar = (u) => {
    setEditando(u)
    setModalAbierto(true)
  }
  const cerrarModal = () => {
    setModalAbierto(false)
    setEditando(null)
  }

  const confirmarEliminar = async () => {
    const u = pidiendoEliminar
    try {
      await eliminarUsuarioAPI(u._id)
      setPidiendoEliminar(null)
      recargar()
      toast.exito(`"${u.nombre}" eliminado`)
    } catch (e) {
      setPidiendoEliminar(null)
      toast.error(e.response?.data?.error || 'No se pudo eliminar')
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-xs uppercase text-negro/60 tracking-tight">
            Cuentas
          </p>
          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-none">
            Usuarios.
          </h1>
        </div>
        <button onClick={abrirNuevo} className="btn btn-aceptar">
          + Nuevo usuario
        </button>
      </div>

      {cargando && <p className="font-mono uppercase">Cargando...</p>}
      {error && (
        <div className="card !p-4 bg-rojo-faro text-white font-mono uppercase">
          Error al cargar usuarios
        </div>
      )}

      {usuarios && usuarios.length > 0 && (
        <div className="card !p-0 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-negro text-white">
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-tight">
                  Nombre
                </th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-tight">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-mono text-xs uppercase tracking-tight">
                  Rol
                </th>
                <th className="text-right px-4 py-3 font-mono text-xs uppercase tracking-tight">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr
                  key={u._id}
                  className={`border-t-2 border-negro ${i % 2 === 0 ? 'bg-white' : 'bg-crema'}`}
                >
                  <td className="px-4 py-3 font-display font-bold uppercase tracking-tight">
                    {u.nombre}
                    {u._id === yo?.id && (
                      <span className="badge badge-confirmado ml-2 !py-0 text-[10px]">Vos</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm break-all">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${COLORES_ROL[u.rol] || 'badge-pendiente'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => abrirEditar(u)}
                        className="btn btn-secundario !px-3 !py-2 text-xs"
                      >
                        Editar
                      </button>
                      {/* Evitamos que el admin se auto-elimine y se quede afuera */}
                      {u._id !== yo?.id && (
                        <button
                          onClick={() => setPidiendoEliminar(u)}
                          className="btn btn-peligro !px-3 !py-2 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        abierto={modalAbierto}
        onCerrar={cerrarModal}
        titulo={editando ? 'Editar usuario' : 'Nuevo usuario'}
      >
        <FormUsuario
          inicial={editando}
          onCancelar={cerrarModal}
          onGuardado={() => {
            const fueEdicion = !!editando
            cerrarModal()
            recargar()
            toast.exito(fueEdicion ? 'Usuario actualizado' : 'Usuario creado')
          }}
        />
      </Modal>

      <ModalConfirmacion
        abierto={!!pidiendoEliminar}
        onCerrar={() => setPidiendoEliminar(null)}
        onConfirmar={confirmarEliminar}
        titulo="Eliminar usuario"
        mensaje={`¿Seguro que querés eliminar a "${pidiendoEliminar?.nombre}"? Si tenía un Empleado o Cliente vinculado, esos quedarán sin cuenta.`}
        textoConfirmar="Eliminar"
        peligro
      />
    </div>
  )
}

function FormUsuario({ inicial, onCancelar, onGuardado }) {
  const esEdicion = !!inicial
  const [nombre, setNombre] = useState(inicial?.nombre || '')
  const [email, setEmail] = useState(inicial?.email || '')
  const [password, setPassword] = useState('')
  const [rol, setRol] = useState(inicial?.rol || 'cliente')
  const [errores, setErrores] = useState({})
  const [errorGlobal, setErrorGlobal] = useState('')
  const [enviando, setEnviando] = useState(false)

  const validar = () => {
    const errs = {}
    if (!nombre.trim()) errs.nombre = 'El nombre es obligatorio'
    else if (nombre.trim().length < 2) errs.nombre = 'Mínimo 2 caracteres'
    if (!email.trim()) errs.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email inválido'
    // En edición la password es opcional (si no la mandás, no se cambia).
    if (!esEdicion && !password) errs.password = 'Ingresá una contraseña'
    else if (password && password.length < 6) errs.password = 'Mínimo 6 caracteres'
    return errs
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setErrorGlobal('')
    const errs = validar()
    setErrores(errs)
    if (Object.keys(errs).length > 0) return

    setEnviando(true)
    try {
      const payload = { nombre: nombre.trim(), email: email.trim(), rol }
      if (password) payload.password = password
      if (esEdicion) await actualizarUsuarioAPI(inicial._id, payload)
      else await crearUsuarioAPI(payload)
      onGuardado()
    } catch (e) {
      setErrorGlobal(e.response?.data?.error || 'No se pudo guardar')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {errorGlobal && (
        <div className="border-3 border-negro bg-rojo-faro text-white px-4 py-3 font-mono text-sm uppercase">
          {errorGlobal}
        </div>
      )}

      <div>
        <label className="label" htmlFor="nombre">Nombre</label>
        <input id="nombre" type="text" className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {errores.nombre && <p className="font-mono text-xs text-rojo-faro mt-2 uppercase">{errores.nombre}</p>}
      </div>

      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        {errores.email && <p className="font-mono text-xs text-rojo-faro mt-2 uppercase">{errores.email}</p>}
      </div>

      <div>
        <label className="label" htmlFor="password">
          Contraseña {esEdicion && <span className="text-negro/60 normal-case font-mono text-[10px]">(opcional — dejar vacío para no cambiarla)</span>}
        </label>
        <input
          id="password"
          type="password"
          className="input"
          placeholder={esEdicion ? 'Vacío para no cambiarla' : '6+ caracteres'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        {errores.password && <p className="font-mono text-xs text-rojo-faro mt-2 uppercase">{errores.password}</p>}
      </div>

      <div>
        <label className="label" htmlFor="rol">Rol</label>
        <select id="rol" className="input" value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="cliente">Cliente</option>
          <option value="empleado">Empleado</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className="flex gap-3 pt-4 border-t-2 border-negro">
        <button type="button" onClick={onCancelar} className="btn btn-secundario flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={enviando} className="btn btn-primario flex-1">
          {enviando ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
