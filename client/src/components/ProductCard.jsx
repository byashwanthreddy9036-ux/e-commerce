import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const addToCartHandler = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await api.post(`/cart/inc/${product._id}`)
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  const addToWishlistHandler = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await api.post(`/wishlist/${product._id}`)
    } catch (err) {
      console.error(err.response?.data?.message || 'Failed to add to wishlist')
    }
  }

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition'>
      <div onClick={() => navigate(`/product/${product._id}`)} className='cursor-pointer'>
        {product.image ? (
          <img src={product.image} alt={product.name} className='w-full h-48 object-cover rounded-xl' />
        ) : (
          <div className='w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm'>No Image</div>
        )}
        <div className='mt-3'>
          <h3 className='font-semibold text-gray-800 truncate'>{product.name}</h3>
          {product.brand && <p className='text-sm text-gray-500'>{product.brand}</p>}
          <p className='text-xs text-gray-400 capitalize mt-1'>{product.category}</p>
          <div className='flex items-center justify-between mt-2'>
            <span className='text-lg font-bold text-blue-600'>₹{product.price}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
      {user?.role !== 'admin' && (
        <div className='flex gap-2'>
          <button onClick={addToCartHandler} disabled={product.stock < 1} className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition'>
            Add to Cart
          </button>
          <button onClick={addToWishlistHandler} className='flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 rounded-xl text-sm font-medium transition'>
            Wishlist
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductCard
