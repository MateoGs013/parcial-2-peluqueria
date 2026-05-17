// Lógica de negocio de Empleados.

import { Empleado } from '../models/Empleado.js'

// populate('usuario', 'nombre email rol') reemplaza el ObjectId del campo
// "usuario" por un objeto con esos campos del documento User referenciado.
// Es como un JOIN pero a nivel aplicación.
const POBLAR_USUARIO = { path: 'usuario', select: 'nombre email rol' }

export const listarEmpleados = async ({ soloActivos = false } = {}) => {
  const filtro = soloActivos ? { activo: true } : {}
  return Empleado.find(filtro).populate(POBLAR_USUARIO).sort({ createdAt: -1 })
}

export const obtenerEmpleado = async (id) => {
  const empleado = await Empleado.findById(id).populate(POBLAR_USUARIO)
  if (!empleado) throw conError('Empleado no encontrado', 404)
  return empleado
}

export const crearEmpleado = async (datos) => {
  return Empleado.create(datos)
}

export const actualizarEmpleado = async (id, datos) => {
  const empleado = await Empleado.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  }).populate(POBLAR_USUARIO)
  if (!empleado) throw conError('Empleado no encontrado', 404)
  return empleado
}

export const eliminarEmpleado = async (id) => {
  const empleado = await Empleado.findByIdAndDelete(id)
  if (!empleado) throw conError('Empleado no encontrado', 404)
  return empleado
}

const conError = (mensaje, status) => {
  const error = new Error(mensaje)
  error.status = status
  return error
}
