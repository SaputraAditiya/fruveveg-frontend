import { useEffect, useState } from 'react'
import { getMyOrders } from '../api/order.api'
import { useNavigate } from 'react-router-dom'
import Container from '../components/layout/Container'
import { Package, Clock, CheckCircle, XCircle, Truck, ShoppingBag } from 'lucide-react'

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data.data))
      .finally(() => setLoading(false))
  }, [])

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

  if (loading) {
    return (
      <Container>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </Container>
    )
  }

  if (orders.length === 0) {
    return (
      <Container>
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <button
            onClick={() => navigate('/app/products')}
            className="btn btn-primary"
          >
            Browse Products
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">View and manage your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const statusConfig = getStatusConfig(order.status)
          const StatusIcon = statusConfig.icon

          return (
            <div
              key={order.id}
              onClick={() => navigate(`/app/order/${order.id}`)}
              className="card p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-grow">
                  <div className="flex items-center space-x-3 mb-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>📅 {formatDate(order.createdAt)}</p>
                    <p>📦 {order.items.length} items</p>
                    <p>💳 {order.payment}</p>
                  </div>
                </div>

                {/* Total Price */}
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              {/* Preview Items */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex -space-x-2 overflow-hidden">
                  {order.items.slice(0, 5).map((item, idx) => (
                    <img
                      key={idx}
                      src={`http://localhost:3000${item.product.image}`}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                  {order.items.length > 5 && (
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      +{order.items.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}