import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth()

  // React state may not have flushed yet right after login(); fall back to
  // localStorage so the first render after navigate() still sees the user.
  const effectiveUser = user ?? (() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })()

  if (!effectiveUser) return <Navigate to='/login' />
  if (adminOnly && effectiveUser.role !== 'admin') return <Navigate to='/' />
  if (!adminOnly && effectiveUser.role === 'admin') return <Navigate to='/admin/products' />
  return children
}

export default ProtectedRoute
