// Conexión a MongoDB usando Mongoose.
// Si la conexión falla, cortamos el proceso: no tiene sentido levantar el
// servidor sin base de datos.

import mongoose from 'mongoose'
import dns from 'node:dns'

// MongoDB Atlas usa connection strings con prefijo "mongodb+srv://" que
// resuelven los nodos del cluster vía un registro DNS de tipo SRV.
// Algunos ISPs (en especial en Latinoamérica) no resuelven SRV correctamente,
// y la conexión falla con "querySrv ECONNREFUSED".
// Forzamos a Node a usar DNS de Cloudflare y Google solo en este proceso
// (no toca la config del sistema) para evitar ese problema.
dns.setServers(['1.1.1.1', '8.8.8.8'])

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
