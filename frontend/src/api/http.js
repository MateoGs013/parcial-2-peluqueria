// Cliente HTTP basado en axios.
// - baseURL "/api" es relativa: en desarrollo Vite hace proxy a localhost:4000
//   (ver vite.config.js); en producción el frontend se sirve desde el mismo
//   dominio que el backend.
// - Persistimos el token en localStorage para sobrevivir recargas.
// - Interceptor de request: agrega el header Authorization automáticamente
//   si hay token, así las funciones de api no tienen que preocuparse por eso.
// - Interceptor de response: si la API devuelve 401, borramos el token —
//   significa que está vencido o es inválido y hay que volver a loguear.

import axios from 'axios'

const CLAVE_TOKEN = 'peluqueria.token'

export const guardarToken = (token) => localStorage.setItem(CLAVE_TOKEN, token)
export const obtenerToken = () => localStorage.getItem(CLAVE_TOKEN)
export const borrarToken = () => localStorage.removeItem(CLAVE_TOKEN)

export const http = axios.create({ baseURL: '/api' })

http.interceptors.request.use((config) => {
  const token = obtenerToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error.response?.status === 401) {
      borrarToken()
    }
    return Promise.reject(error)
  }
)
