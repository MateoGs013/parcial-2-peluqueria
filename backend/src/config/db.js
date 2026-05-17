// Conexión a MongoDB usando Mongoose.
// Si la conexión falla, cortamos el proceso: no tiene sentido levantar el
// servidor sin base de datos.

import mongoose from 'mongoose'

export const conectarDB = async () => {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI no está definida en .env')
    await mongoose.connect(uri)
    console.log('MongoDB conectado')
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message)
    process.exit(1)
  }
}
