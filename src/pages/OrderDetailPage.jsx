import { useEffect, useState } from 'react'
import { getOrderById, cancelOrder } from '../api/order.api'
import { useParams, useNavigate } from 'react-router-dom'
import Container from '../components/layout/Container'
import { ArrowLeft, MapPin, CreditCard, Package, XCircle, CheckCircle, Clock, Truck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    getOrderById(id)
      .then(res => setOrder(res.data.data))
      .catch(() => {
        toast.error('Order not found')
        navigate('/app/orders')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        label: 'Pending'
      },
      PAID: {
        icon: CheckCircle,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        label: 'Paid'
      },
      SHIPPED: {
        icon: Truck,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        label: 'Shipped'
      },
      COMPLETED: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        label: 'Completed'
      },
      CANCELLED: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        label: 'Cancelled'
      }
    }
    return configs[status] || configs.PENDING
  }

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    setCanceling(true)
    try {
      await cancelOrder(id)
      toast.success('Order cancelled successfully')
      // Refresh order data
      const res = await getOrderById(id)
      setOrder(res.data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order')
    } finally {
      setCanceling(false)
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="card p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </Container>
    )
  }

  if (!order) return null

  const statusConfig = getStatusConfig(order.status)
  const StatusIcon = statusConfig.icon
  const canCancel = order.status === 'PENDING'

  return (
    <Container>
      {/* Back Button */}
      <button
        onClick={() => navigate('/app/orders')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Orders</span>
      </button>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Package className="w-6 h-6 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id}
              </h1>
            </div>
            <p className="text-gray-600">📅 {formatDate(order.createdAt)}</p>
            {order.cancelAt && (
              <p className="text-red-600 text-sm mt-1">
                Cancelled at: {formatDate(order.cancelAt)}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.label}
            </span>

            {canCancel && (
              <button
                onClick={handleCancelOrder}
                disabled={canceling}
                className="btn bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center space-x-2"
              >
                {canceling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Order</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
          
          {order.items.map(item => (
            <div key={item.id} className="card p-4">
              <div className="flex gap-4">
                <img
                  src={`http://localhost:3000${item.product.image}`}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">{item.product.category?.name}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {item.product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </span>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-4">
          {/* Delivery Info */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-sm text-gray-600">{order.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Payment</p>
                  <p className="text-sm text-gray-600">{order.payment}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({order.items.length} items)</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}