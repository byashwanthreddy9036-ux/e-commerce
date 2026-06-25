import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Package, LogOut, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const logoutHandler = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200'>
      <div className='max-w-6xl mx-auto px-4 h-16 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2 text-blue-600 font-bold text-xl'>
          <Store size={22} />
          ShopEase
        </Link>

        <div className='flex items-center gap-1'>
          {user ? (
            <>
              {user.role !== 'admin' && (
                <>
                  <Link to='/cart' className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition text-sm font-medium'>
                    <ShoppingCart size={16} />
                    Cart
                  </Link>
                  <Link to='/wishlist' className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition text-sm font-medium'>
                    <Heart size={16} />
                    Wishlist
                  </Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to='/admin/products' className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition text-sm font-medium'>
                  <Package size={16} />
                  Products
                </Link>
              )}
              {user.role !== 'admin' ? (
                <Link to='/profile' className='px-3 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition text-sm font-semibold'>
                  {user.fullname.split(' ')[0]}
                </Link>
              ) : (
                <span className='px-3 py-2 text-gray-700 text-sm font-semibold'>{user.fullname}</span>
              )}
              <button onClick={logoutHandler} className='flex items-center gap-1.5 ml-1 px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition text-sm font-medium'>
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='px-3 py-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition text-sm font-medium'>
                Login
              </Link>
              <Link to='/register' className='px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition text-sm font-semibold'>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
