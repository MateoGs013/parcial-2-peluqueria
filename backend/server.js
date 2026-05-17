// Punto de entrada del servidor.
// Carga variables de entorno, conecta a Mongo y arranca Express.

import 'dotenv/config'
import { conectarDB } from './src/config/db.js'
import { app } from './src/app.js'

const PORT = process.env.PORT || 4000

const iniciar = async () => {
  await conectarDB()
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  })
}

iniciar()
