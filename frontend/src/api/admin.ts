import api from './axios'

// ==================== BACKUP & SYSTEM ====================
export interface BackupInfo {
  fileName: string
  size: number
  lastModified: number
}

export interface BackupResult {
  fileName: string
  path: string
  size: number
  createdAt: string
  createdBy: string
}

export const createBackup = async () => {
  const response = await api.post('/admin/system/backups')
  return response.data
}

export const listBackups = async () => {
  const response = await api.get('/admin/system/backups')
  return response.data
}

export const downloadBackup = async (fileName: string) => {
  const response = await api.get(`/admin/system/backups/${fileName}`, {
    responseType: 'blob',
  })
  return response
}

// ==================== USERS ====================
export interface User {
  id: number
  email: string
  fullName: string
  phone?: string
  status: 'ACTIVE' | 'DISABLED' | 'LOCKED'
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  transactionCount?: number
  totalAmount?: number
}

export interface UsersResponse {
  content: User[]
  totalElements: number
  totalPages: number
}

export const getUsers = async (params?: {
  keyword?: string
  page?: number
  size?: number
}) => {
  const response = await api.get('/admin/users', { params })
  return response.data
}

export const getUserDetail = async (id: number) => {
  const response = await api.get(`/admin/users/${id}`)
  return response.data
}

export const lockUser = async (id: number) => {
  const response = await api.put(`/admin/users/${id}/lock`)
  return response.data
}

export const unlockUser = async (id: number) => {
  const response = await api.put(`/admin/users/${id}/unlock`)
  return response.data
}

export const resetUserPassword = async (id: number, newPassword: string) => {
  const response = await api.put(`/admin/users/${id}/reset-password`, null, {
    params: { newPassword },
  })
  return response.data
}

export const makeAdmin = async (id: number) => {
  const response = await api.put(`/admin/users/${id}/make-admin`)
  return response.data
}

// ==================== USER TRANSACTIONS ====================
export interface Transaction {
  id: number
  amount: number
  category: {
    id: number
    name: string
    icon?: string
    color?: string
    type?: string
  } | null
  transactionDate: string
  note?: string
  location?: string
  receiptImage?: string
  createdAt: string
  updatedAt: string
  createdBy?: 'USER' | 'ADMIN'
  createdByAdminId?: number
}

export interface TransactionsResponse {
  content: Transaction[]
  totalElements: number
  totalPages: number
}

export const getUserTransactions = async (
  userId: number,
  params?: { page?: number; size?: number }
) => {
  const response = await api.get(`/admin/users/${userId}/transactions`, {
    params,
  })
  return response.data
}

export const createTransactionForUser = async (
  userId: number,
  data: {
    categoryId: number
    amount: number | string
    transactionDate: string
    note?: string
    location?: string
    receiptImage?: string
  }
) => {
  const response = await api.post(`/admin/users/${userId}/transactions`, data)
  return response.data
}

export const updateUserTransaction = async (
  userId: number,
  transactionId: number,
  data: {
    categoryId?: number
    amount?: number | string
    transactionDate?: string
    note?: string
    location?: string
    receiptImage?: string
  }
) => {
  const response = await api.put(
    `/admin/users/${userId}/transactions/${transactionId}`,
    data
  )
  return response.data
}

export const deleteUserTransaction = async (
  userId: number,
  transactionId: number
) => {
  const response = await api.delete(
    `/admin/users/${userId}/transactions/${transactionId}`
  )
  return response.data
}

// ==================== STATISTICS ====================
export interface SystemStatistics {
  totalUsers: number
  activeUsers: number
  totalTransactions: number
  totalAmount: number
}

export const getSystemStatistics = async () => {
  const response = await api.get('/admin/statistics')
  return response.data
}

// ==================== ALL TRANSACTIONS ====================
export const getAllTransactions = async (params?: {
  keyword?: string
  userId?: number
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}) => {
  const response = await api.get('/admin/transactions', { params })
  return response.data
}

// ==================== CATEGORIES ====================
export interface Category {
  id: number
  name: string
  icon?: string
  color?: string
  type: 'income' | 'expense'
  description?: string
  systemDefault: boolean
  userId?: number
  createdAt: string
  updatedAt: string
}

export const getAllCategories = async (params?: {
  keyword?: string
  type?: 'income' | 'expense'
  page?: number
  size?: number
}) => {
  const response = await api.get('/admin/categories', { params })
  return response.data
}

export const createCategory = async (data: {
  name: string
  icon?: string
  color?: string
  type: 'income' | 'expense'
  description?: string
  systemDefault?: boolean
}) => {
  const response = await api.post('/admin/categories', data)
  return response.data
}

export const updateCategory = async (
  id: number,
  data: {
    name?: string
    icon?: string
    color?: string
    type?: 'income' | 'expense'
    description?: string
  }
) => {
  const response = await api.put(`/admin/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/admin/categories/${id}`)
  return response.data
}
