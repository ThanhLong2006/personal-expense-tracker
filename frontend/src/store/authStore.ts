import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserRole } from '../types/user'

/**
 * Interface cho thông tin user
 */
interface User {
  id: number
  email: string
  fullName: string
  role: UserRole
  twoFactorEnabled: boolean
  avatarUrl?: string;
}

/**
 * Interface cho auth state
 */
interface AuthState {
  token: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User, refreshToken?: string | null) => void
  updateAccessToken: (token: string) => void
  logout: () => void
  isAdmin: () => boolean
}

/**
 * Auth store sử dụng Zustand
 * - Lưu token và user info
 * - Persist vào localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      // Set authentication (sau khi login thành công)
      setAuth: (token: string, user: User, refreshToken?: string | null) => {
        set({
          token,
          refreshToken: refreshToken ?? null,
          user,
          isAuthenticated: true,
        })
      },

      // Update access token only (used by axios interceptor)
      updateAccessToken: (token: string) => {
        set({ token })
      },

      // Logout
      logout: () => {
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },

      // Kiểm tra có phải admin không
      isAdmin: () => {
        const { user } = get()
        return user?.role === UserRole.ADMIN
      },
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
    }
  )
)
