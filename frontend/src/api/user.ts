import api from './axios'

/**
 * API for user profile management
 */

export interface UserProfile {
  id: number
  email: string
  fullName: string
  phone?: string
  avatar?: string
  role: 'USER' | 'ADMIN'
  twoFactorEnabled: boolean
}

export interface UpdateProfileRequest {
  fullName?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// Get current user profile
export const getCurrentUser = async () => {
  const response = await api.get('/users/me')
  return response.data
}

// Update user profile
export const updateProfile = async (data: UpdateProfileRequest) => {
  const response = await api.put('/users/me', data)
  return response.data
}

// Change password
export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await api.put('/users/me/password', data)
  return response.data
}

// Upload avatar
export const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)
  const response = await api.put('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

