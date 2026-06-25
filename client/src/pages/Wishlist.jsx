import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const Wishlist = () => {
  const navigate = useNavigate()
  const [products, setproducts] = useState([])
  const [loading, setloading] = useState(true)
  const [error, seterror] = useState('')
  const [success, setsuccess] = useState('')

  const fetchWishlist = async () => {
    setloading(true)
    seterror('')
    try {
      const wishRes = await api.get('/wishlist/')
      const productIds = wishRes.data.data.products
      if (productIds.length === 0) { setproducts([]); setloading(false); return }
      const productDetails = await Promise.all(productIds.map(id => api.get(`/product/${id}`)))
      setproducts(productDetails.map(res => res.data.data))
      setloading(false)
    } catch (err) {
      if (err.response?.status === 404) { setproducts([]); setloading(false) }
      else { seterror('Failed to load wishlist'); setloading(false) }
    }
  }

  useEffect(() => { fetchWishlist() }, [])

  const removeHandler = async (productId) => {
    try { await api.delete(`/wishlist/${productId}`); fetchWishlist() }
    catch { seterror('Failed to remove item') }
  }

  const moveToCartHandler = async (productId) => {
    seterror('')
    setsuccess('')
    try {
      await api.post(`/wishlist/move-to-cart/${productId}`)
      setsuccess('Moved to cart!')
      fetchWishlist()
    } catch (err) {
      seterror(err.response?.data?.message || 'Failed to move to cart')
    }
  }

  const clearWishlistHandler = async () => {
    try { await api.delete('/wishlist/delete-all'); setproducts([]) }
    catch { seterror('Failed to clear wishlist') }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-4xl mx-auto px-4 py-10'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Wishlist</h2>
          {products.length > 0 && (
            <button onClick={clearWishlistHandler} className='text-sm text-gray-400 hover:text-red-500 transition font-medium'>
              Clear all
            </button>
          )}
        </div>

        {error && <div className='mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm'>{error}</div>}
        {success && <div className='mb-4 rounded-xl bg-green-50 border border-green-100 text-green-600 px-4 py-3 text-sm'>{success}</div>}

        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className='bg-white rounded-2xl overflow-hidden animate-pulse'>
                <div className='w-full h-44 bg-gray-100' />
                <div className='p-4 space-y-2'>
                  <div className='h-4 bg-gray-100 rounded w-3/4' />
                  <div className='h-4 bg-gray-100 rounded w-1/3' />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className='text-center py-24'>
            <Heart size={48} className='mx-auto text-gray-200 mb-4' />
            <p className='text-gray-400 font-medium mb-6'>Your wishlist is empty</p>
            <button onClick={() => navigate('/')} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition'>
              Browse Products
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {products.map(product => (
              <div key={product._id} className='bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition'>
                <div onClick={() => navigate(`/product/${product._id}`)} className='cursor-pointer relative'>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className='w-full h-44 object-cover' />
                  ) : (
                    <div className='w-full h-44 bg-gray-100' />
                  )}
                  {product.category && (
                    <span className='absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-medium text-gray-600 px-2.5 py-1 rounded-full capitalize'>
                      {product.category}
                    </span>
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-800 leading-snug'>{product.name}</h3>
                  <div className='flex items-center justify-between mt-2 mb-4'>
                    <span className='text-blue-600 font-bold text-lg'>₹{product.price.toLocaleString()}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => moveToCartHandler(product._id)}
                      disabled={product.stock < 1}
                      className='flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-2.5 rounded-xl text-sm font-medium transition'
                    >
                      <ShoppingCart size={14} />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeHandler(product._id)}
                      className='px-3 py-2.5 rounded-xl border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400 transition'
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
