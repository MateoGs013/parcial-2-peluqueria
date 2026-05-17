// Lógica de negocio de Turnos.
// Lo más importante de este service es validar que un empleado no tenga
// dos turnos cuyos horarios se superpongan.

import { Turno } from '../models/Turno.js'
import { Cliente } from '../models/Cliente.js'
import { Empleado } from '../models/Empleado.js'
import { Servicio } from '../models/Servicio.js'

// Estructura de populate reusable: trae solo los campos que el frontend
// necesita mostrar, no los documentos completos.
const POBLAR = [
  { path: 'cliente', select: 'nombre email telefono' },
  { path: 'empleado', select: 'nombre especialidad' },
  { path: 'servicio', select: 'nombre precio duracionMinutos' },
]

export const listarTurnos = async ({
  clienteId,
  empleadoId,
  estado,
  desde,
  hasta,
} = {}) => {
  const filtro = {}
  if (clienteId) filtro.cliente = clienteId
  if (empleadoId) filtro.empleado = empleadoId
  if (estado) filtro.estado = estado
  if (desde || hasta) {
    filtro.fechaHora = {}
    if (desde) filtro.fechaHora.$gte = new Date(desde)
    if (hasta) filtro.fechaHora.$lte = new Date(hasta)
  }
  return Turno.find(filtro).populate(POBLAR).sort({ fechaHora: 1 })
}

export const obtenerTurno = async (id) => {
  const turno = await Turno.findById(id).populate(POBLAR)
  if (!turno) throw conError('Turno no encontrado', 404)
  return turno
}

export const crearTurno = async (datos) => {
  // 1) Verificamos que las 3 entidades referenciadas existan.
  // Lo hacemos en paralelo con Promise.all porque son queries independientes.
  const [cliente, empleado, servicio] = await Promise.all([
    Cliente.findById(datos.cliente),
    Empleado.findById(datos.empleado),
    Servicio.findById(datos.servicio),
  ])
  if (!cliente) throw conError('Cliente no encontrado', 404)
  if (!empleado) throw conError('Empleado no encontrado', 404)
  if (!servicio) throw conError('Servicio no encontrado', 404)

  // 2) Calculamos el rango horario [inicio, fin] del turno que se quiere crear.
  // El fin = inicio + duración del servicio.
  const inicio = new Date(datos.fechaHora)
  const fin = new Date(inicio.getTime() + servicio.duracionMinutos * 60_000)

  // 3) Verificamos que el empleado no tenga otro turno solapado.
  if (await hayTurnoSuperpuesto({ empleadoId: datos.empleado, inicio, fin })) {
    throw conError('El empleado ya tiene un turno en ese horario', 409)
  }

  const turno = await Turno.create(datos)
  return Turno.findById(turno._id).populate(POBLAR)
}

export const actualizarTurno = async (id, datos) => {
  // Si están cambiando fecha, empleado o servicio, hay que re-chequear
  // superposición. Si solo cambian estado/notas, no hace falta.
  if (datos.fechaHora || datos.empleado || datos.servicio) {
    const actual = await Turno.findById(id).populate('servicio', 'duracionMinutos')
    if (!actual) throw conError('Turno no encontrado', 404)

    const empleadoId = datos.empleado || actual.empleado
    const servicioId = datos.servicio || actual.servicio._id
    const fechaHora = datos.fechaHora ? new Date(datos.fechaHora) : actual.fechaHora

    const servicio = await Servicio.findById(servicioId)
    if (!servicio) throw conError('Servicio no encontrado', 404)

    const fin = new Date(fechaHora.getTime() + servicio.duracionMinutos * 60_000)

    // excluirId: no chequear contra el mismo turno que estamos actualizando.
    if (await hayTurnoSuperpuesto({
      empleadoId,
      inicio: fechaHora,
      fin,
      excluirId: id,
    })) {
      throw conError('El empleado ya tiene un turno en ese horario', 409)
    }
  }

  const turno = await Turno.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  }).populate(POBLAR)
  if (!turno) throw conError('Turno no encontrado', 404)
  return turno
}

export const eliminarTurno = async (id) => {
  const turno = await Turno.findByIdAndDelete(id)
  if (!turno) throw conError('Turno no encontrado', 404)
  return turno
}

// Detecta si el empleado ya tiene un turno activo (no cancelado) cuyo
// rango [t.inicio, t.fin] se superpone con el rango [inicio, fin] pedido.
//
// REGLA MATEMÁTICA: dos rangos [a1, a2] y [b1, b2] se SUPERPONEN cuando
// a1 < b2  Y  b1 < a2. Si alguna desigualdad no se cumple, uno termina
// antes que el otro empiece y NO hay solapamiento.
//
// Para no traer todos los turnos del empleado, primero filtramos en Mongo
// los que tienen fechaHora < fin (descartan los que empiezan después del
// nuestro). Después, en código, calculamos su fin y aplicamos la regla.
const hayTurnoSuperpuesto = async ({
  empleadoId,
  inicio,
  fin,
  excluirId = null,
}) => {
  const filtroBase = {
    empleado: empleadoId,
    estado: { $ne: 'cancelado' },
    fechaHora: { $lt: fin },
  }
  if (excluirId) filtroBase._id = { $ne: excluirId }

  const candidatos = await Turno.find(filtroBase).populate('servicio', 'duracionMinutos')

  for (const t of candidatos) {
    const tInicio = t.fechaHora
    const duracion = t.servicio?.duracionMinutos || 0
    const tFin = new Date(tInicio.getTime() + duracion * 60_000)
    // tFin > inicio => el turno existente termina DESPUÉS del que queremos
    // crear empiece => hay superposición.
    if (tFin > inicio) return true
  }
  return false
}

const conError = (mensaje, status) => {
  const error = new Error(mensaje)
  error.status = status
  return error
}
