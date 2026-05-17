import { http } from './http.js'

export const listarUsuariosAPI = async () => (await http.get('/usuarios')).data

export const obtenerUsuarioAPI = async (id) =>
  (await http.get(`/usuarios/${id}`)).data

export const crearUsuarioAPI = async (datos) =>
  (await http.post('/usuarios', datos)).data

export const actualizarUsuarioAPI = async (id, datos) =>
  (await http.put(`/usuarios/${id}`, datos)).data

export const eliminarUsuarioAPI = async (id) =>
  (await http.delete(`/usuarios/${id}`)).data
