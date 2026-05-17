// Modelo de Cliente de la peluquería.
// "usuario" es opcional: un cliente puede existir como "walk-in" cargado por
// el admin sin tener cuenta, o estar vinculado a un User con rol cliente.

import mongoose from 'mongoose'

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    telefono: { type: String, trim: true, default: '' },
    notas: { type: String, trim: true, default: '' },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null,
    },
  },
  { timestamps: true }
)

export const Cliente = mongoose.model('Cliente', clienteSchema)
