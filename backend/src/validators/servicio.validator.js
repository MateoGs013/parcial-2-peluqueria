// Validación de payloads de Servicio.

import { body, param } from 'express-validator'

export const reglasCrear = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 80 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número >= 0'),
  body('duracionMinutos').isInt({ min: 5 }).withMessage('La duración debe ser al menos 5 minutos'),
  body('activo').optional().isBoolean(),
]

export const reglasActualizar = [
  body('nombre').optional().trim().notEmpty().isLength({ max: 80 }),
  body('descripcion').optional().trim().isLength({ max: 500 }),
  body('precio').optional().isFloat({ min: 0 }),
  body('duracionMinutos').optional().isInt({ min: 5 }),
  body('activo').optional().isBoolean(),
]

export const reglaIdParam = [param('id').isMongoId().withMessage('ID inválido')]
