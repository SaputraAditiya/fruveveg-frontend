import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import ProductsPage from "../pages/ProductsPage"
import CartPage from "../pages/CartPage"
import OrderHistoryPage from "../pages/OrderHistoryPage"
import OrderDetailPage from "../pages/OrderDetailPage"
import NotFoundPage from "../pages/NotFoundPage"
import ProtectedRoute from "./ProtectedRoute"
import AdminRoute from "./AdminRoute"

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminProducts from "../pages/admin/AdminProducts"
import AdminOrders from "../pages/admin/AdminOrders"
import AdminCategories from "../pages/admin/AdminCategories"
import AdminUsers from "../pages/admin/AdminUsers"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected - User */}
      <Route
        path="/app/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/cart"
        element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/orders"
        element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Protected - Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminCategories />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}