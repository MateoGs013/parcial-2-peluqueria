// Lógica de negocio de Clientes.

import { Cliente } from '../models/Cliente.js'

const POBLAR_USUARIO = { path: 'usuario', select: 'nombre email rol' }

export const listarClientes = async ({ busqueda = '' } = {}) => {
  // Si llega "busqueda" en la query, filtramos por nombre o email (case-insensitive).
  // Esto le va a servir al frontend para una caja de búsqueda en la página de clientes.
  const filtro = busqueda
    ? {
        $or: [
          { nombre: { $regex: busqueda, $options: 'i' } },
          { email: { $regex: busqueda, $options: 'i' } },
        ],
      }
    : {}
  return Cliente.find(filtro).populate(POBLAR_USUARIO).sort({ createdAt: -1 })
}

export const obtenerCliente = async (id) => {
  const cliente = await Cliente.findById(id).populate(POBLAR_USUARIO)
  if (!cliente) throw conError('Cliente no encontrado', 404)
  return cliente
}

export const crearCliente = async (datos) => {
  return Cliente.create(datos)
}

export const actualizarCliente = async (id, datos) => {
  const cliente = await Cliente.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  }).populate(POBLAR_USUARIO)
  if (!cliente) throw conError('Cliente no encontrado', 404)
  return cliente
}

export const eliminarCliente = async (id) => {
  const cliente = await Cliente.findByIdAndDelete(id)
  if (!cliente) throw conError('Cliente no encontrado', 404)
  return cliente
}

const conError = (mensaje, status) => {
  const error = new Error(mensaje)
  error.status = status
  return error
}
