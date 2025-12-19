import { api } from './client'

// Products
export const getAllProducts = (params) => {
  const query = new URLSearchParams(params).toString()
  return api.get(`/product?${query}`)
}

export const createProduct = (data) => {
  return api.post('/product', data)
}

export const updateProduct = (id, data) => {
  return api.patch(`/product/${id}`, data)
}

export const deleteProduct = (id) => {
  return api.delete(`/product/${id}`)
}

// Categories
export const getAllCategories = () => {
  return api.get('/category')
}

export const createCategory = (data) => {
  return api.post('/category', data)
}

export const updateCategory = (id, data) => {
  return api.patch(`/category/${id}`, data)
}

export const deleteCategory = (id) => {
  return api.delete(`/category/${id}`)
}

// Orders
export const getAllOrders = () => {
  return api.get('/order')
}

export const updateOrderStatus = (id, status) => {
  return api.patch(`/order/${id}/status`, { status })
}

// Users
export const getAllUsers = () => {
  return api.get('/users')
}

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`)
}