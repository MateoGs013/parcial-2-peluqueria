import { http } from './http.js'

export const listarEmpleadosAPI = async (params = {}) =>
  (await http.get('/empleados', { params })).data

export const obtenerEmpleadoAPI = async (id) =>
  (await http.get(`/empleados/${id}`)).data

export const crearEmpleadoAPI = async (datos) =>
  (await http.post('/empleados', datos)).data

export const actualizarEmpleadoAPI = async (id, datos) =>
  (await http.put(`/empleados/${id}`, datos)).data

export const eliminarEmpleadoAPI = async (id) =>
  (await http.delete(`/empleados/${id}`)).data
