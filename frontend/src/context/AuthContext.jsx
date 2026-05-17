// Context global de autenticación.
// Cualquier componente que necesite saber quién está logueado o invocar
// login/logout llama al hook useAuth() (ver src/hooks/useAuth.js).
//
// Cómo funciona la "rehidratación":
// Cuando se monta el provider (o sea, al abrir la app), si hay token en
// localStorage llamamos al backend GET /api/auth/yo para validar el token
// y traer los datos del usuario. Si el token es inválido o vencido, el
// interceptor de http lo borra y dejamos al usuario en null.

import { createContext, useState, useEffect } from 'react'
import { loginAPI, registrarAPI, yoAPI, logoutAPI } from '../api/auth.api.js'
import { obtenerToken } from '../api/http.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const rehidratar = async () => {
      if (!obtenerToken()) {
        setCargando(false)
        return
      }
      try {
        const datos = await yoAPI()
        setUsuario(datos)
      } catch {
        setUsuario(null)
      } finally {
        setCargando(false)
      }
    }
    rehidratar()
  }, [])

  const login = async (credenciales) => {
    const { usuario } = await loginAPI(credenciales)
    setUsuario(usuario)
    return usuario
  }

  const registrar = async (datos) => {
    const { usuario } = await registrarAPI(datos)
    setUsuario(usuario)
    return usuario
  }

  const logout = () => {
    logoutAPI()
    setUsuario(null)
  }

  const valor = { usuario, cargando, login, registrar, logout }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
