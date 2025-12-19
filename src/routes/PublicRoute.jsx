import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/auth.store"

export default function PublicRoute({ children }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)

    if (isAuthenticated) {
        return <Navigate to="/product" replace />
    }

    return children
}
