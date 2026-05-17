import { http } from './http.js'

export const listarServiciosAPI = async (params = {}) =>
  (await http.get('/servicios', { params })).data

export const obtenerServicioAPI = async (id) =>
  (await http.get(`/servicios/${id}`)).data

export const crearServicioAPI = async (datos) =>
  (await http.post('/servicios', datos)).data

export const actualizarServicioAPI = async (id, datos) =>
  (await http.put(`/servicios/${id}`, datos)).data

export const eliminarServicioAPI = async (id) =>
  (await http.delete(`/servicios/${id}`)).data
