import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (userData, token) => {
    setuser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('auth-token', token)
  }

  const logout = () => {
    setuser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('auth-token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
