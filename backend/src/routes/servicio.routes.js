// Rutas de Servicios.
// Listar y obtener son públicos (sirven para una landing pública de reservas).
// Crear / actualizar / eliminar son solo admin.

import { Router } from 'express'
import * as ctrl from '../controllers/servicio.controller.js'
import { reglasCrear, reglasActualizar, reglaIdParam } from '../validators/servicio.validator.js'
import { validarRequest } from '../middlewares/validacion.js'
import { requireAuth, requireRol } from '../middlewares/auth.js'

export const servicioRouter = Router()

servicioRouter.get('/', ctrl.listar)
servicioRouter.get('/:id', reglaIdParam, validarRequest, ctrl.obtener)

servicioRouter.post('/', requireAuth, requireRol('admin'), reglasCrear, validarRequest, ctrl.crear)
servicioRouter.put(
  '/:id',
  requireAuth,
  requireRol('admin'),
  reglaIdParam,
  reglasActualizar,
  validarRequest,
  ctrl.actualizar
)
servicioRouter.delete(
  '/:id',
  requireAuth,
  requireRol('admin'),
  reglaIdParam,
  validarRequest,
  ctrl.eliminar
)
