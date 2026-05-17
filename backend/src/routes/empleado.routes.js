// Rutas de Empleados.
// Listar/obtener: cualquier usuario autenticado.
// Crear/actualizar/eliminar: solo admin.

import { Router } from 'express'
import * as ctrl from '../controllers/empleado.controller.js'
import { reglasCrear, reglasActualizar, reglaIdParam } from '../validators/empleado.validator.js'
import { validarRequest } from '../middlewares/validacion.js'
import { requireAuth, requireRol } from '../middlewares/auth.js'

export const empleadoRouter = Router()

empleadoRouter.get('/', requireAuth, ctrl.listar)
empleadoRouter.get('/:id', requireAuth, reglaIdParam, validarRequest, ctrl.obtener)

empleadoRouter.post('/', requireAuth, requireRol('admin'), reglasCrear, validarRequest, ctrl.crear)
empleadoRouter.put(
  '/:id',
  requireAuth,
  requireRol('admin'),
  reglaIdParam,
  reglasActualizar,
  validarRequest,
  ctrl.actualizar
)
empleadoRouter.delete(
  '/:id',
  requireAuth,
  requireRol('admin'),
  reglaIdParam,
  validarRequest,
  ctrl.eliminar
)
