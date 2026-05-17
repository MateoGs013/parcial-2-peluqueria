// Validación de payloads de Empleado.

import { body, param } from 'express-validator'

export const reglasCrear = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ max: 80 }),
  body('especialidad').trim().notEmpty().withMessage('La especialidad es obligatoria').isLength({ max: 80 }),
  body('telefono').optional().trim().isLength({ max: 30 }),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Email inválido').normalizeEmail(),
  body('usuario').optional({ nullable: true }).isMongoId().withMessage('Usuario inválido'),
  body('activo').optional().isBoolean(),
]

export const reglasActualizar = [
  body('nombre').optional().trim().notEmpty().isLength({ max: 80 }),
  body('especialidad').optional().trim().notEmpty().isLength({ max: 80 }),
  body('telefono').optional().trim().isLength({ max: 30 }),
  body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body('usuario').optional({ nullable: true }).isMongoId(),
  body('activo').optional().isBoolean(),
]

export const reglaIdParam = [param('id').isMongoId().withMessage('ID inválido')]
