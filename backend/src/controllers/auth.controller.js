// Controllers de auth: solo manejan la parte HTTP (leer req, devolver res).
// La lógica de hash / comparación / JWT vive en services/auth.service.js.

import {
  registrarUsuario,
  iniciarSesion,
  obtenerUsuarioPorId,
} from '../services/auth.service.js'

export const registrar = async (req, res, next) => {
  try {
    const data = await registrarUsuario(req.body)
    res.status(201).json(data)
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const data = await iniciarSesion(req.body)
    res.json(data)
  } catch (error) {
    next(error)
  }
}

// GET /api/auth/yo
// Devuelve el usuario del token. El frontend lo usa al recargar la página
// para "rehidratar" la sesión sin pedir login otra vez.
export const yo = async (req, res, next) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.usuario.id)
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
    res.json({
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    })
  } catch (error) {
    next(error)
  }
}
