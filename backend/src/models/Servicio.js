// Modelo de Servicio: corte, color, brushing, etc.

import mongoose from 'mongoose'

const servicioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    descripcion: { type: String, trim: true, default: '' },
    precio: { type: Number, required: true, min: [0, 'El precio no puede ser negativo'] },
    duracionMinutos: {
      type: Number,
      required: true,
      min: [5, 'La duración mínima es 5 minutos'],
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Servicio = mongoose.model('Servicio', servicioSchema)
