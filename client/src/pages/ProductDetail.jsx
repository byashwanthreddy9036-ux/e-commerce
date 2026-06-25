import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, ArrowLeft, Check, Tag, Box } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setproduct] = useState(null)
  const [loading, setloading] = useState(true)
  const [error, seterror] = useState('')
  const [cartMsg, setcartMsg] = useState('')
  const [wishMsg, setwishMsg] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      setloading(true)
      try {
        const response = await api.get(`/product/${id}`)
        setproduct(response.data.data)
        setloading(false)
      } catch {
        seterror('Product not found')
        setloading(false)
      }
    }
    fetchProduct()
  }, [id])

  const flash = (setter, msg) => {
    setter(msg)
    setTimeout(() => setter(''), 2500)
  }

  const addToCartHandler = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await api.post(`/cart/inc/${product._id}`)
      flash(setcartMsg, 'added')
    } catch (err) {
      flash(setcartMsg, err.response?.data?.message || 'error')
    }
  }

  const addToWishlistHandler = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await api.post(`/wishlist/${product._id}`)
      flash(setwishMsg, 'saved')
    } catch (err) {
      flash(setwishMsg, 'error')
    }
  }

  if (loading) return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-4xl mx-auto px-4 py-10'>
        <div className='bg-white rounded-3xl border border-gray-100 p-8 flex flex-col md:flex-row gap-8 animate-pulse'>
          <div className='md:w-1/2 h-80 bg-gray-100 rounded-2xl' />
          <div className='md:w-1/2 space-y-4'>
            <div className='h-6 bg-gray-100 rounded w-3/4' />
            <div className='h-4 bg-gray-100 rounded w-1/2' />
            <div className='h-20 bg-gray-100 rounded' />
            <div className='h-10 bg-gray-100 rounded-xl' />
          </div>
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='text-center py-20 text-gray-400'>{error}</div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-4xl mx-auto px-4 py-10'>
        <button onClick={() => navigate(-1)} className='flex items-center gap-1.5 text-gray-500 hover:text-blue-600 mb-6 text-sm font-medium transition'>
          <ArrowLeft size={16} /> Back
        </button>

        <div className='bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col md:flex-row'>
          <div className='md:w-1/2 bg-gray-50'>
            {product.image ? (
              <img src={product.image} alt={product.name} className='w-full h-full min-h-72 object-cover' />
            ) : (
              <div className='w-full h-72 flex items-center justify-center text-gray-300'>No Image</div>
            )}
          </div>

          <div className='md:w-1/2 p-8 flex flex-col gap-5'>
            <div>
              {product.category && (
                <span className='inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3 capitalize'>
                  <Tag size={11} />
                  {product.category}
                </span>
              )}
              <h1 className='text-2xl font-bold text-gray-800 leading-snug'>{product.name}</h1>
              {product.brand && <p className='text-gray-400 text-sm mt-1'>{product.brand}</p>}
            </div>

            <p className='text-gray-500 leading-relaxed text-sm'>{product.description}</p>

            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-blue-600'>₹{product.price.toLocaleString()}</span>
              <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                <Box size={12} />
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>

            {user?.role !== 'admin' && (
              <div className='flex flex-col gap-2.5 mt-1'>
                <button
                  onClick={addToCartHandler}
                  disabled={product.stock < 1}
                  className='flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition'
                >
                  {cartMsg === 'added' ? <Check size={17} /> : <ShoppingCart size={17} />}
                  {cartMsg === 'added' ? 'Added to Cart!' : cartMsg ? cartMsg : 'Add to Cart'}
                </button>
                <button
                  onClick={addToWishlistHandler}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border transition ${wishMsg === 'saved' ? 'border-pink-300 bg-pink-50 text-pink-500' : 'border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50'}`}
                >
                  <Heart size={17} fill={wishMsg === 'saved' ? 'currentColor' : 'none'} />
                  {wishMsg === 'saved' ? 'Saved to Wishlist!' : 'Add to Wishlist'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
