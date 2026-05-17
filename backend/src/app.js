// Configuración de la app de Express.
// Acá se montan los middlewares globales y las rutas principales.
// Separamos app.js de server.js para que la app sea importable (útil para tests
// y para mantener single responsibility).

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { authRouter } from './routes/auth.routes.js'
import { servicioRouter } from './routes/servicio.routes.js'
import { empleadoRouter } from './routes/empleado.routes.js'
import { clienteRouter } from './routes/cliente.routes.js'
import { usuarioRouter } from './routes/usuario.routes.js'

export const app = express()

// Middlewares globales
app.use(cors())              // permite peticiones desde el frontend (otro origen/puerto)
app.use(express.json())      // parsea bodies JSON entrantes a req.body
app.use(morgan('dev'))       // loguea cada petición HTTP en la consola

// Ruta de salud — sirve para chequear que el server esté vivo
app.get('/api/salud', (req, res) => {
  res.json({ ok: true, mensaje: 'API funcionando' })
})

// Rutas de la API
app.use('/api/auth', authRouter)
app.use('/api/servicios', servicioRouter)
app.use('/api/empleados', empleadoRouter)
app.use('/api/clientes', clienteRouter)
app.use('/api/usuarios', usuarioRouter)
// TODO: montar /api/turnos.

// Manejador de errores global. Captura todo lo que tiren los controllers con
// next(error). Debe ir DESPUÉS de todas las rutas y tener 4 parámetros para
// que Express lo identifique como handler de errores.
app.use((error, req, res, next) => {
  console.error(error)
  const status = error.status || 500
  res.status(status).json({ error: error.message || 'Error del servidor' })
})
