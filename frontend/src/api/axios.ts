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

// Refresh token – Dùng HttpOnly Cookie (nếu được bật ở backend)
// Khi dùng HttpOnly Cookie, trình duyệt sẽ tự gởi cookie đính kèm nhờ withCredentials: true
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token))
  refreshSubscribers = []
}

api.defaults.withCredentials = true // Cần thiết để gửi/nhận cookie qua CORS

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && originalConfig && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise(resolve => {
          subscribeTokenRefresh((token: string) => {
            originalConfig.headers.setAuthorization(`Bearer ${token}`)
            resolve(api(originalConfig))
          })
        })
      }

      originalConfig._retry = true
      isRefreshing = true

      // Khi dùng HttpOnly Cookie, backend sẽ lấy tokens từ cookie. 
      // Tuy nhiên interface vẫn hỗ trợ gửi token qua params để tương thích ngược.
      const refreshToken = useAuthStore.getState().refreshToken

      try {
        const res = await axios.post<{ data?: { token?: string }; token?: string }>(
          `${baseURL}/auth/refresh`,
          null,
          {
            params: refreshToken ? { refreshToken } : {}, // Gửi nếu có (localStorage), nếu không backend sẽ tự tìm trong Cookie
            withCredentials: true
          }
        )

        const newToken = res.data?.data?.token || res.data?.token
        if (newToken) {
          useAuthStore.getState().updateAccessToken(newToken)
          originalConfig.headers.setAuthorization(`Bearer ${newToken}`)
          onRefreshed(newToken)
          isRefreshing = false
          return api(originalConfig)
        }
      } catch (err) {
        console.error('Refresh token failed:', err)
      }

      // Thất bại hoàn toàn → logout
      isRefreshing = false
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

export default api
