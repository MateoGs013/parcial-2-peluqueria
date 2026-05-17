// Validación de payloads de Cliente.

import { body, param } from 'express-validator'

export const reglasCrear = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 80 }),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email inválido').normalizeEmail(),
  body('telefono').optional().trim().isLength({ max: 30 }),
  body('notas').optional().trim().isLength({ max: 500 }),
  body('usuario').optional({ nullable: true }).isMongoId(),
]

export const reglasActualizar = [
  body('nombre').optional().trim().notEmpty().isLength({ max: 80 }),
  body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body('telefono').optional().trim().isLength({ max: 30 }),
  body('notas').optional().trim().isLength({ max: 500 }),
  body('usuario').optional({ nullable: true }).isMongoId(),
]

export const reglaIdParam = [param('id').isMongoId().withMessage('ID inválido')]
