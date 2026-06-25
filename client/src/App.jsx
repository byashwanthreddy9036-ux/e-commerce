import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'
import AdminLogin from './pages/admin/AdminLogin'
import AdminProducts from './pages/admin/AdminProducts'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/' element={<Home />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/admin/products' element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
