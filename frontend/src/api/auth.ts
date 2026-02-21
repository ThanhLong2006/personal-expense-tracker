import api from './axios'

/**
 * API authentication
 */

// Đăng ký
export const register = async (data: {  
  email: string
  password: string
  fullName: string
  phone?: string
}) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

// Verify OTP
export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await api.post('/auth/verify-otp', data)
  return response.data
}

// Resend OTP
export const resendOtp = async (email: string) => {
  const response = await api.post('/auth/resend-otp', null, {
    params: { email },
  })
  return response.data
}

// Đăng nhập
export const login = async (data: { email: string; password: string; totpCode?: string }) => {
  const response = await api.post('/auth/login', data)

  const token = response.data?.data?.token || response.data?.token
  const refreshToken = response.data?.data?.refreshToken || response.data?.refreshToken

  if (token) {
    localStorage.setItem('accessToken', token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
  }

  return response.data
}

export const refreshToken = async (refreshToken: string) => {
  const response = await api.post('/auth/refresh', null, { params: { refreshToken } })
  return response.data
}

// Quên mật khẩu
export const forgotPassword = async (email: string) => {
  const response = await api.post('/auth/forgot-password', null, {
    params: { email },
  })
  return response.data
}

// Reset mật khẩu
export const resetPassword = async (token: string, newPassword: string) => {
  const response = await api.post('/auth/reset-password', null, {
    params: { token, newPassword },
  })
  return response.data
}

