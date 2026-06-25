import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, Check } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const ProductCard = ({ product }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cartMsg, setcartMsg] = useState('')
  const [wishMsg, setwishMsg] = useState('')

  const flash = (setter, msg) => {
    setter(msg)
    setTimeout(() => setter(''), 2000)
  }

  const addToCartHandler = async (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    try {
      await api.post(`/cart/inc/${product._id}`)
      flash(setcartMsg, 'added')
    } catch (err) {
      flash(setcartMsg, err.response?.data?.message || 'error')
    }
  }

  const addToWishlistHandler = async (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    try {
      await api.post(`/wishlist/${product._id}`)
      flash(setwishMsg, 'saved')
    } catch (err) {
      flash(setwishMsg, 'error')
    }
  }

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className='group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col'
    >
      <div className='relative overflow-hidden bg-gray-50'>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className='w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300'
          />
        ) : (
          <div className='w-full h-52 flex items-center justify-center text-gray-300 text-sm'>No Image</div>
        )}
        {product.stock < 1 && (
          <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
            <span className='bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full'>Out of Stock</span>
          </div>
        )}
        {product.category && (
          <span className='absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full capitalize'>
            {product.category}
          </span>
        )}
      </div>

      <div className='p-4 flex flex-col gap-3 flex-1'>
        <div className='flex-1'>
          <h3 className='font-semibold text-gray-800 leading-snug line-clamp-2'>{product.name}</h3>
          {product.brand && <p className='text-xs text-gray-400 mt-1'>{product.brand}</p>}
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-xl font-bold text-blue-600'>₹{product.price.toLocaleString()}</span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className='text-xs text-orange-500 font-medium'>Only {product.stock} left</span>
          )}
        </div>

        {user?.role !== 'admin' && (
          <div className='flex gap-2'>
            <button
              onClick={addToCartHandler}
              disabled={product.stock < 1}
              className='flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium transition'
            >
              {cartMsg === 'added' ? <Check size={14} /> : <ShoppingCart size={14} />}
              {cartMsg === 'added' ? 'Added!' : cartMsg || 'Add to Cart'}
            </button>
            <button
              onClick={addToWishlistHandler}
              className={`px-3 py-2.5 rounded-xl border transition ${wishMsg === 'saved' ? 'border-pink-300 bg-pink-50 text-pink-500' : 'border-gray-200 text-gray-500 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50'}`}
            >
              <Heart size={16} fill={wishMsg === 'saved' ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
