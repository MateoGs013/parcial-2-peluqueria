// Controller HTTP de Turnos.
// Tiene lógica de rol para que un cliente solo vea/cree turnos para si mismo.

import * as turnoService from '../services/turno.service.js'
import { Cliente } from '../models/Cliente.js'

// Si el usuario logueado es cliente, devuelve su documento Cliente
// (el que tiene Cliente.usuario === req.usuario.id). Si no, null.
const obtenerClienteDelUsuario = async (req) => {
  if (req.usuario.rol !== 'cliente') return null
  return Cliente.findOne({ usuario: req.usuario.id })
}

export const listar = async (req, res, next) => {
  try {
    const filtros = {
      empleadoId: req.query.empleadoId,
      clienteId: req.query.clienteId,
      estado: req.query.estado,
      desde: req.query.desde,
      hasta: req.query.hasta,
    }
    // Si el usuario es cliente, lo forzamos a ver SOLO sus propios turnos.
    if (req.usuario.rol === 'cliente') {
      const miCliente = await obtenerClienteDelUsuario(req)
      if (!miCliente) return res.json([])
      filtros.clienteId = miCliente._id
    }
    const turnos = await turnoService.listarTurnos(filtros)
    res.json(turnos)
  } catch (error) {
    next(error)
  }
}

export const obtener = async (req, res, next) => {
  try {
    const turno = await turnoService.obtenerTurno(req.params.id)
    // Si el solicitante es cliente, validamos que el turno sea suyo.
    if (req.usuario.rol === 'cliente') {
      const miCliente = await obtenerClienteDelUsuario(req)
      if (!miCliente || String(turno.cliente._id) !== String(miCliente._id)) {
        return res.status(403).json({ error: 'No podés ver turnos de otros clientes' })
      }
    }
    res.json(turno)
  } catch (error) {
    next(error)
  }
}

export const crear = async (req, res, next) => {
  try {
    // Un cliente solo puede crear turnos para su propio perfil Cliente.
    if (req.usuario.rol === 'cliente') {
      const miCliente = await obtenerClienteDelUsuario(req)
      if (!miCliente) {
        return res.status(400).json({
          error: 'No tenés un perfil de cliente vinculado. Pedile al admin que lo cree.',
        })
      }
      if (String(req.body.cliente) !== String(miCliente._id)) {
        return res.status(403).json({ error: 'No podés crear turnos para otro cliente' })
      }
    }
    const turno = await turnoService.crearTurno(req.body)
    res.status(201).json(turno)
  } catch (error) {
    next(error)
  }
}

export const actualizar = async (req, res, next) => {
  try {
    const turno = await turnoService.actualizarTurno(req.params.id, req.body)
    res.json(turno)
  } catch (error) {
    next(error)
  }
}

export const eliminar = async (req, res, next) => {
  try {
    await turnoService.eliminarTurno(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}
