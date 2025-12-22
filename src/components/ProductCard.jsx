import { ShoppingCart, Package } from "lucide-react"
import { useCartStore } from "../store/cart.store"
import { API_BASE_URL } from "../api/client"
import toast from "react-hot-toast"

export default function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error("Product out of stock")
      return
    }
    addItem(product, 1)
    toast.success(`${product.name} added to cart`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={`${API_BASE_URL}${product.image}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-primary-700 bg-primary-50 rounded">
            {product.category?.name || 'Uncategorized'}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || 'No description available'}
        </p>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </p>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Package className="w-4 h-4" />
            <span className="text-sm">{product.stock}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn btn-primary w-full flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}