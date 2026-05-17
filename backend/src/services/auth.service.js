// Lógica de autenticación: hashear / comparar contraseñas y firmar JWTs.
// Está separada del controller para que el controller solo se ocupe de la
// parte HTTP (leer req, devolver res) y la lógica de negocio quede reusable.

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Usuario } from '../models/Usuario.js'

// bcrypt usa un "salt" aleatorio que queda incrustado DENTRO del hash final.
// 10 rounds = 2^10 iteraciones internas. Es el balance estándar entre
// seguridad y velocidad para una app web.
const SALT_ROUNDS = 10

export const registrarUsuario = async ({ nombre, email, password }) => {
  // El registro público crea SIEMPRE rol "cliente". Empleados y admins se
  // crean desde un endpoint admin-only o por seed (ver Fase 3).
  const yaExiste = await Usuario.findOne({ email })
  if (yaExiste) {
    const error = new Error('Ya existe un usuario con ese email')
    error.status = 409
    throw error
  }

  // bcrypt.hash genera el salt internamente y devuelve el hash final.
  const passwordHasheada = await bcrypt.hash(password, SALT_ROUNDS)

  const usuario = await Usuario.create({
    nombre,
    email,
    password: passwordHasheada,
    // rol queda en default 'cliente'
  })

  return generarRespuestaAuth(usuario)
}

export const iniciarSesion = async ({ email, password }) => {
  // .select('+password') anula el "select: false" del modelo para poder
  // comparar el hash. Es la única query donde necesitamos la contraseña.
  const usuario = await Usuario.findOne({ email }).select('+password')
  if (!usuario) {
    const error = new Error('Credenciales inválidas')
    error.status = 401
    throw error
  }

  // bcrypt.compare hashea el password ingresado usando el mismo salt
  // incrustado en el hash guardado y compara los resultados.
  // NUNCA "desencripta" — bcrypt es one-way.
  const coincide = await bcrypt.compare(password, usuario.password)
  if (!coincide) {
    const error = new Error('Credenciales inválidas')
    error.status = 401
    throw error
  }

  return generarRespuestaAuth(usuario)
}

export const obtenerUsuarioPorId = async (id) => {
  return Usuario.findById(id)
}

// Empaqueta el usuario (sin password) + un JWT firmado, listo para devolver.
const generarRespuestaAuth = (usuario) => {
  const payload = { id: usuario._id.toString(), rol: usuario.rol }

  // jwt.sign firma el payload con la clave secreta (HMAC-SHA256 por default).
  // El token resultante tiene 3 partes: {base64(header)}.{base64(payload)}.{firma}.
  // El payload se puede LEER por cualquiera (no va encriptado), pero solo el
  // servidor con la clave puede generar firmas válidas, así que nadie puede
  // modificar el contenido sin que la firma deje de coincidir.
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

  return {
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  }
}
