import { useEffect, useState } from "react"
import { api } from "../api/client"
import ProductCard from "../components/ProductCard"
import Pagination from "../components/Pagination"
import ProductSkeleton from "../components/ProductSkeleton"
import Container from "../components/layout/Container"
import { Search, SlidersHorizontal } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [sort, setSort] = useState("")

  // Fetch categories
  useEffect(() => {
    api.get("/category").then(res => {
      setCategories(res.data.data)
    })
  }, [])

  // Fetch products
  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({
      page,
      limit: 8,
      ...(search && { search }),
      ...(categoryId && { categoryId }),
      ...(sort && { sort })
    })

    api.get(`/product?${params}`)
      .then(res => {
        setProducts(res.data.data.items)
        setMeta(res.data.data.meta)
      })
      .finally(() => setLoading(false))
  }, [page, search, categoryId, sort])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1) // Reset to page 1 when searching
  }

  return (
    <Container>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fresh Products</h1>
        <p className="text-gray-600">Browse our selection of fresh fruits and vegetables</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-11"
            />
          </form>

          {/* Category Filter */}
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value)
              setPage(1)
            }}
            className="input"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
            className="input"
          >
            <option value="">Default Sort</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="price_asc">Price (Low to High)</option>
            <option value="price_desc">Price (High to Low)</option>
            <option value="stock_asc">Stock (Low to High)</option>
            <option value="stock_desc">Stock (High to Low)</option>
          </select>
        </div>

        {/* Active Filters Info */}
        {(search || categoryId || sort) && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {meta.total || 0} results
            </p>
            <button
              onClick={() => {
                setSearch("")
                setCategoryId("")
                setSort("")
                setPage(1)
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters</p>
          <button
            onClick={() => {
              setSearch("")
              setCategoryId("")
              setSort("")
            }}
            className="btn btn-primary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={meta.totalPages || 1}
              onChange={setPage}
            />
          </div>
        </>
      )}
    </Container>
  )
}