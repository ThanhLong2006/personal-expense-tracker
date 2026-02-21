import api from './axios'

/**
 * API cho Dashboard
 */

// Lấy thống kê tổng quan
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats')
  return response.data
}

// Lấy chi tiêu theo danh mục
export const getCategoryExpenses = async (startDate: string, endDate: string) => {
  const response = await api.get('/dashboard/category-expenses', {
    params: { startDate, endDate },
  })
  return response.data
}

// Lấy xu hướng chi tiêu
export const getExpenseTrend = async (period: 'day' | 'week' | 'month' | 'year') => {
  const response = await api.get('/dashboard/expense-trend', {
    params: { period },
  })
  return response.data
}

// Lấy top categories
export const getTopCategories = async (limit: number = 5) => {
  const response = await api.get('/dashboard/top-categories', {
    params: { limit },
  })
  return response.data
}

// Lấy giao dịch gần đây
export const getRecentTransactions = async (limit: number = 10) => {
  const response = await api.get('/dashboard/recent-transactions', {
    params: { limit },
  })
  return response.data
}

// Lấy AI prediction
export const getAiPrediction = async () => {
  const response = await api.get('/ai/prediction')
  return response.data
}

