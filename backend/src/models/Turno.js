// Modelo de Turno: una reserva con cliente + empleado + servicio + fecha.

import mongoose from 'mongoose'

const turnoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
    },
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Empleado',
      required: true,
    },
    servicio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Servicio',
      required: true,
    },
    fechaHora: { type: Date, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmado', 'completado', 'cancelado'],
      default: 'pendiente',
    },
    notas: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
)

export const Turno = mongoose.model('Turno', turnoSchema)
