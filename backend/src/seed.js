// Script de seed: crea un usuario admin inicial si no existe.
// Se ejecuta con `npm run seed` desde la carpeta backend.
//
// Después de correrlo, se puede loguear con:
//   email:    admin@peluqueria.com
//   password: admin123
//
// En producción esto NO se haría así (un admin con password fijo). Acá es un
// atajo para el parcial: necesitamos un admin para gestionar empleados y
// crear más usuarios, y el endpoint de registro público solo crea clientes.

import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { conectarDB } from './config/db.js'
import { Usuario } from './models/Usuario.js'
import mongoose from 'mongoose'

const ADMIN_EMAIL = 'admin@peluqueria.com'
const ADMIN_PASSWORD = 'admin123'

const seed = async () => {
  await conectarDB()

  const yaExiste = await Usuario.findOne({ email: ADMIN_EMAIL })
  if (yaExiste) {
    console.log(`El admin ${ADMIN_EMAIL} ya existe, no hago nada.`)
  } else {
    const passwordHasheada = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await Usuario.create({
      nombre: 'Administrador',
      email: ADMIN_EMAIL,
      password: passwordHasheada,
      rol: 'admin',
    })
    console.log(`Admin creado: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('Error en el seed:', err)
  process.exit(1)
})
