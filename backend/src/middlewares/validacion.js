// Middleware que recoge los errores acumulados por express-validator y los
// devuelve como un 400 uniforme. Se usa al final de cada cadena de validadores
// en las rutas (ver routes/auth.routes.js para un ejemplo).

import { validationResult } from 'express-validator'

export const validarRequest = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({
      error: 'Datos inválidos',
      detalles: errores.array().map((e) => ({ campo: e.path, mensaje: e.msg })),
    })
  }
  next()
}
