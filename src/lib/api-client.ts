import axios from 'axios'

import useAuthStore from '@/store/auth.store'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  // Antes axios buscaba el token directamente en localStorage.
  // const token = localStorage.getItem('access_token')
  // Ahora lo lee desde STORE.
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Antes limpiabamos storage manualmente.
      // localStorage.removeItem('access_token')
      // La redireccion ya no ocurre aca, deberian manejarlas los guards.
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  },
)

export default apiClient
