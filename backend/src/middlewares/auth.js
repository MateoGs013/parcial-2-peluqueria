// Middlewares de autenticación (¿quién sos?) y autorización (¿podés?).

import jwt from 'jsonwebtoken'

// requireAuth: verifica que la petición venga con un JWT válido.
// El frontend envía el token en el header "Authorization: Bearer <token>".
// Si todo OK, deja info del usuario en req.usuario para los handlers siguientes.
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no provisto' })
  }

  const token = header.slice(7) // saca el prefijo "Bearer "
  try {
    // jwt.verify valida la firma con JWT_SECRET y chequea expiración.
    // Si algo no cierra, tira excepción y caemos al catch.
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = { id: payload.id, rol: payload.rol }
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

// requireRol: middleware factory. Recibe los roles permitidos y devuelve el
// middleware que verifica si req.usuario.rol está entre ellos.
// Uso: router.get('/secreto', requireAuth, requireRol('admin'), handler)
// IMPORTANTE: debe ir SIEMPRE después de requireAuth, porque depende de req.usuario.
export const requireRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'No autenticado' })
    }
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tenés permisos para esta acción' })
    }
    next()
  }
}
