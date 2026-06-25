import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const logoutHandler = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className='bg-white shadow-sm border-b border-gray-200 px-4 py-3'>
      <div className='max-w-6xl mx-auto flex items-center justify-between'>
        <Link to='/' className='text-xl font-bold text-blue-600'>Ecom</Link>
        <div className='flex items-center gap-4'>
          <Link to='/' className='text-gray-600 hover:text-blue-600 transition text-sm'>Home</Link>
          {user ? (
            <>
              {user.role !== 'admin' && (
                <>
                  <Link to='/cart' className='text-gray-600 hover:text-blue-600 transition text-sm'>Cart</Link>
                  <Link to='/wishlist' className='text-gray-600 hover:text-blue-600 transition text-sm'>Wishlist</Link>
                </>
              )}
              {user.role === 'admin' && (
                <Link to='/admin/products' className='text-gray-600 hover:text-blue-600 transition text-sm'>Products</Link>
              )}
              <Link to='/profile' className='text-gray-600 hover:text-blue-600 transition text-sm font-medium'>{user.fullname}</Link>
              <button onClick={logoutHandler} className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-gray-600 hover:text-blue-600 transition text-sm'>Login</Link>
              <Link to='/register' className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition'>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
