import { api } from './client'

export const createOrder = ({ items, address, payment }) => {
  return api.post('/order', {
    items,
    address,
    payment
  })
}

export const getMyOrders = () => {
  return api.get('/order')
}

export const getOrderById = (id) => {
  return api.get(`/order/${id}`)
}

export const cancelOrder = (id) => {
  return api.patch(`/order/${id}/cancel`)
}