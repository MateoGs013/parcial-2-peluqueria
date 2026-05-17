// Modelo de Empleado (peluquero / colorista / barbero).
// El campo "usuario" lo liga a un User con rol "empleado" si tiene cuenta
// para loguearse en el sistema; es opcional.

import mongoose from 'mongoose'

const empleadoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    especialidad: { type: String, required: true, trim: true },
    telefono: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null,
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Empleado = mongoose.model('Empleado', empleadoSchema)
