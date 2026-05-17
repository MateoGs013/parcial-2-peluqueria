// Controller HTTP de Empleados.

import * as empleadoService from '../services/empleado.service.js'

export const listar = async (req, res, next) => {
  try {
    const soloActivos = req.query.activos === 'true'
    const empleados = await empleadoService.listarEmpleados({ soloActivos })
    res.json(empleados)
  } catch (error) {
    next(error)
  }
}

export const obtener = async (req, res, next) => {
  try {
    const empleado = await empleadoService.obtenerEmpleado(req.params.id)
    res.json(empleado)
  } catch (error) {
    next(error)
  }
}

export const crear = async (req, res, next) => {
  try {
    const empleado = await empleadoService.crearEmpleado(req.body)
    res.status(201).json(empleado)
  } catch (error) {
    next(error)
  }
}

export const actualizar = async (req, res, next) => {
  try {
    const empleado = await empleadoService.actualizarEmpleado(req.params.id, req.body)
    res.json(empleado)
  } catch (error) {
    next(error)
  }
}

export const eliminar = async (req, res, next) => {
  try {
    await empleadoService.eliminarEmpleado(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
