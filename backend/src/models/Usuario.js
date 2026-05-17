// Modelo de Usuario.
// Guarda credenciales (email + password hasheado) y el rol que decide qué
// puede hacer el usuario en la app.

import mongoose from 'mongoose'

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    // El password se guarda SIEMPRE como hash bcrypt, nunca en texto plano.
    // select: false hace que Mongoose NO lo devuelva en los .find() por defecto,
    // así evitamos filtrar el hash en las respuestas de la API por accidente.
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      select: false,
    },
    rol: {
      type: String,
      enum: ['admin', 'empleado', 'cliente'],
      default: 'cliente',
    },
  },
  {
    timestamps: true, // agrega createdAt y updatedAt automáticamente
  }
)

export const Usuario = mongoose.model('Usuario', usuarioSchema)
