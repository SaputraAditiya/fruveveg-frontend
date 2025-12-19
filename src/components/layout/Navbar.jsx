import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { useCartStore } from '../../store/cart.store'
import { ShoppingCart, Package, LogOut, User, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const totalItems = useCartStore(state => state.getTotalItems())
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  if (!isAuthenticated) return null

  const isAdmin = user?.role === 'admin'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/app/products" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FruVeveg</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/app/products"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Products
            </Link>
            
            {!isAdmin && (
              <Link
                to="/app/cart"
                className="relative text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <Link
              to="/app/orders"
              className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="hidden sm:inline">Orders</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
              >
                <Shield className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Admin</span>
              </Link>
            )}

            {/* User Menu */}
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${isAdmin ? 'bg-purple-100' : 'bg-primary-100'} rounded-full flex items-center justify-center`}>
                  <User className={`w-4 h-4 ${isAdmin ? 'text-purple-600' : 'text-primary-600'}`} />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  {isAdmin && (
                    <p className="text-xs text-purple-600">Admin</p>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}