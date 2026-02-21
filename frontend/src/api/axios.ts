// src/api/axios.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api'

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Gắn token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.setAuthorization(`Bearer ${token}`)
  }
  return config
})

// Refresh token – KHÔNG DÙNG any, KHÔNG LOOP, KHÔNG BỊ ĐÁ
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && originalConfig && !originalConfig._retry) {
      if (isRefreshing) {
        // Đang refresh → chờ
        return new Promise(resolve => {
          subscribeTokenRefresh((token: string) => {
            originalConfig.headers.setAuthorization(`Bearer ${token}`)
            resolve(api(originalConfig))
          })
        })
      }

      originalConfig._retry = true
      isRefreshing = true

      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        try {
          const res = await axios.post<{ data?: { token?: string }; token?: string }>(
            `${baseURL}/auth/refresh`,
            null,
            { params: { refreshToken } }
          )

          const newToken = res.data?.data?.token || res.data?.token
          if (newToken) {
            useAuthStore.getState().updateAccessToken(newToken)
            originalConfig.headers.setAuthorization(`Bearer ${newToken}`)
            onRefreshed(newToken)
            isRefreshing = false
            return api(originalConfig)
          }
        } catch {
          // Refresh thất bại
        }
      }

      // Thất bại hoàn toàn → logout
      isRefreshing = false
      useAuthStore.getState().logout()
      // Optional: Redirect to login if not already handled by store/router
      // window.location.href = '/login' 
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default api
