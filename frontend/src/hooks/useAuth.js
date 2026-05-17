// Hook de conveniencia para acceder al AuthContext.
// Lanza un error si se usa fuera del provider — eso ayuda a detectar bugs
// temprano en vez de tener un "undefined.usuario" misterioso.

import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

export const useAuth = () => {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return contexto
}
