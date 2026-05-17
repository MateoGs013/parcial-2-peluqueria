// Rutas de Usuarios — todas requieren rol admin.

import { Router } from 'express'
import * as ctrl from '../controllers/usuario.controller.js'
import { reglasCrear, reglasActualizar, reglaIdParam } from '../validators/usuario.validator.js'
import { validarRequest } from '../middlewares/validacion.js'
import { requireAuth, requireRol } from '../middlewares/auth.js'

export const usuarioRouter = Router()

usuarioRouter.use(requireAuth, requireRol('admin'))

usuarioRouter.get('/', ctrl.listar)
usuarioRouter.get('/:id', reglaIdParam, validarRequest, ctrl.obtener)
usuarioRouter.post('/', reglasCrear, validarRequest, ctrl.crear)
usuarioRouter.put('/:id', reglaIdParam, reglasActualizar, validarRequest, ctrl.actualizar)
usuarioRouter.delete('/:id', reglaIdParam, validarRequest, ctrl.eliminar)
