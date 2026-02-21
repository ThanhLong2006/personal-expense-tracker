import api from './axios'

export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data.data || []
}

export const createCategory = async (payload: {
  name: string
  icon?: string
  color?: string
  description?: string
  parentId?: number | null
}) => {
  const response = await api.post('/categories', payload)
  return response.data.data
}

export const updateCategory = async (id: number, payload: any) => {
  const response = await api.put(`/categories/${id}`, payload)
  return response.data.data
}

export const deleteCategory = async (id: number) => {
  const response = await api.delete(`/categories/${id}`)
  return response.data
}

export default { getCategories, createCategory }
