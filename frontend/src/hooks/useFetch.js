// Hook para cargar datos de la API con manejo de estados.
// Devuelve { datos, cargando, error, recargar }.
//
// Uso típico en una página:
//   const { datos: servicios, cargando, recargar } = useFetch(() => listarServiciosAPI())
//
// Si la lista de dependencias cambia (ej. filtros), se re-ejecuta el fetch.

import { useState, useEffect, useCallback } from 'react'

export function useFetch(fn, deps = []) {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // useCallback memoiza la función para que useEffect no la re-cree cada
  // render. La dep list permite re-ejecutar cuando cambian filtros, etc.
  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const respuesta = await fn()
      setDatos(respuesta)
    } catch (e) {
      setError(e)
    } finally {
      setCargando(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    cargar()
  }, [cargar])

  return { datos, cargando, error, recargar: cargar }
}
