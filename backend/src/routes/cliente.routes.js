// Rutas de Clientes.
// Listar/obtener/crear/actualizar: admin o empleado.
// Eliminar: solo admin.

import { Router } from 'express'
import * as ctrl from '../controllers/cliente.controller.js'
import { reglasCrear, reglasActualizar, reglaIdParam } from '../validators/cliente.validator.js'
import { validarRequest } from '../middlewares/validacion.js'
import { requireAuth, requireRol } from '../middlewares/auth.js'

export const clienteRouter = Router()

clienteRouter.get('/', requireAuth, requireRol('admin', 'empleado'), ctrl.listar)
clienteRouter.get('/:id', requireAuth, requireRol('admin', 'empleado'), reglaIdParam, validarRequest, ctrl.obtener)

clienteRouter.post(
  '/',
  requireAuth,
  requireRol('admin', 'empleado'),
  reglasCrear,
  validarRequest,
  ctrl.crear
)
clienteRouter.put(
  '/:id',
  requireAuth,
  requireRol('admin', 'empleado'),
  reglaIdParam,
  reglasActualizar,
  validarRequest,
  ctrl.actualizar
)
clienteRouter.delete(
  '/:id',
  requireAuth,
  requireRol('admin'),
  reglaIdParam,
  validarRequest,
  ctrl.eliminar
)
