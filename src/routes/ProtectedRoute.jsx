import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/auth.store"

export default function ProtectedRoute({ children }) {
  const isAuth = useAuthStore(state => state.isAuthenticated)
  return isAuth ? children : <Navigate to="/login" replace />
}
