// Lógica de Usuarios (gestión admin-only).
// El registro público está en auth.service.js; acá manejamos el CRUD que
// usa un admin para gestionar empleados, otros admins y clientes con cuenta.

import bcrypt from 'bcryptjs'
import { Usuario } from '../models/Usuario.js'

const SALT_ROUNDS = 10

export const listarUsuarios = async () => {
  return Usuario.find().sort({ createdAt: -1 })
}

export const obtenerUsuario = async (id) => {
  const usuario = await Usuario.findById(id)
  if (!usuario) throw conError('Usuario no encontrado', 404)
  return usuario
}

export const crearUsuario = async ({ nombre, email, password, rol }) => {
  const yaExiste = await Usuario.findOne({ email })
  if (yaExiste) throw conError('Ya existe un usuario con ese email', 409)

  const passwordHasheada = await bcrypt.hash(password, SALT_ROUNDS)
  return Usuario.create({ nombre, email, password: passwordHasheada, rol })
}

export const actualizarUsuario = async (id, datos) => {
  const payload = { ...datos }
  // Si en el update viene un password nuevo, hay que hashearlo antes de guardar.
  // Si no viene, lo sacamos del payload para no sobreescribir el hash existente
  // con undefined.
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS)
  } else {
    delete payload.password
  }

  const usuario = await Usuario.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
  if (!usuario) throw conError('Usuario no encontrado', 404)
  return usuario
}

export const eliminarUsuario = async (id) => {
  const usuario = await Usuario.findByIdAndDelete(id)
  if (!usuario) throw conError('Usuario no encontrado', 404)
  return usuario
}

const conError = (mensaje, status) => {
  const error = new Error(mensaje)
  error.status = status
  return error
}
