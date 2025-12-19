import { create } from "zustand"

export const useAuthStore = create(set => ({
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),

  loginSuccess: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)

    set({
      user,
      token,
      isAuthenticated: true
    })
  },

  logout: () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    set({
      user: null,
      token: null,
      isAuthenticated: false
    })
  },

  // Helper to check if user is admin
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem("user"))
    return user?.role === 'admin'
  }
}))