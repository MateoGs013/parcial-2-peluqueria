import { http } from './http.js'

export const listarClientesAPI = async (params = {}) =>
  (await http.get('/clientes', { params })).data

export const obtenerClienteAPI = async (id) =>
  (await http.get(`/clientes/${id}`)).data

export const crearClienteAPI = async (datos) =>
  (await http.post('/clientes', datos)).data

export const actualizarClienteAPI = async (id, datos) =>
  (await http.put(`/clientes/${id}`, datos)).data

export const eliminarClienteAPI = async (id) =>
  (await http.delete(`/clientes/${id}`)).data
