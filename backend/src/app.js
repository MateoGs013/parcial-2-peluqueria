// Configuración de la app de Express.
// Acá se montan los middlewares globales y las rutas principales.
// Separamos app.js de server.js para que la app sea importable (útil para tests
// y para mantener single responsibility).

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

export const app = express()

// Middlewares globales
app.use(cors())              // permite peticiones desde el frontend (otro origen/puerto)
app.use(express.json())      // parsea bodies JSON entrantes a req.body
app.use(morgan('dev'))       // loguea cada petición HTTP en la consola

// Ruta de salud — sirve para chequear que el server esté vivo
app.get('/api/salud', (req, res) => {
  res.json({ ok: true, mensaje: 'API funcionando' })
})

// TODO (próximas fases): montar las rutas de auth, usuarios, servicios, empleados, clientes y turnos.
