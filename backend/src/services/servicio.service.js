// Lógica de negocio de Servicios.
// El service encapsula las queries a la DB para que los controllers solo
// manejen HTTP y la lógica sea reutilizable / testeable.

import { Servicio } from '../models/Servicio.js'

export const listarServicios = async ({ soloActivos = false } = {}) => {
  const filtro = soloActivos ? { activo: true } : {}
  return Servicio.find(filtro).sort({ createdAt: -1 })
}

export const obtenerServicio = async (id) => {
  const servicio = await Servicio.findById(id)
  if (!servicio) throw conError('Servicio no encontrado', 404)
  return servicio
}

export const crearServicio = async (datos) => {
  return Servicio.create(datos)
}

export const actualizarServicio = async (id, datos) => {
  // runValidators: true hace que los validadores del schema (min, max, etc)
  // corran también en los update — por default Mongoose solo los corre al crear.
  const servicio = await Servicio.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  })
  if (!servicio) throw conError('Servicio no encontrado', 404)
  return servicio
}

export const eliminarServicio = async (id) => {
  const servicio = await Servicio.findByIdAndDelete(id)
  if (!servicio) throw conError('Servicio no encontrado', 404)
  return servicio
}

const conError = (mensaje, status) => {
  const error = new Error(mensaje)
  error.status = status
  return error
}
