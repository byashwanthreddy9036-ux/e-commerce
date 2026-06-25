import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
      seterror('')
      try {
        const response = await api.get(`/product/${id}`)
        setproduct(response.data.data)
        setloading(false)
      } catch (err) {
        seterror('Product not found')
        setloading(false)
      }
    }
    fetchProduct()
  }, [id])

  const addToCartHandler = async () => {
    if (!user) { navigate('/login'); return }
    setcartMsg('')
    try {
      await api.post(`/cart/inc/${product._id}`)
      setcartMsg('Added to cart!')
    } catch (err) {
      setcartMsg(err.response?.data?.message || 'Failed to add to cart')
    }
  }

  const addToWishlistHandler = async () => {
    if (!user) { navigate('/login'); return }
    setwishMsg('')
    try {
      await api.post(`/wishlist/${product._id}`)
      setwishMsg('Added to wishlist!')
    } catch (err) {
      setwishMsg(err.response?.data?.message || 'Failed to add to wishlist')
    }
  }

  if (loading) return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='text-center py-20 text-gray-500'>Loading...</div>
    </div>
  )

  if (error) return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='text-center py-20 text-red-500'>{error}</div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-4xl mx-auto px-4 py-10'>
        <button onClick={() => navigate(-1)} className='text-blue-600 hover:text-blue-800 mb-6 text-sm font-medium'>← Back</button>
        <div className='bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-8'>
          <div className='md:w-1/2'>
            {product.image ? (
              <img src={product.image} alt={product.name} className='w-full h-80 object-cover rounded-2xl' />
            ) : (
              <div className='w-full h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400'>No Image</div>
            )}
          </div>
          <div className='md:w-1/2 flex flex-col gap-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-800'>{product.name}</h1>
              {product.brand && <p className='text-gray-500 mt-1'>{product.brand}</p>}
              <p className='text-sm text-gray-400 capitalize mt-1'>{product.category}</p>
            </div>
            <p className='text-gray-600 leading-relaxed'>{product.description}</p>
            <div className='flex items-center gap-4'>
              <span className='text-3xl font-bold text-blue-600'>₹{product.price}</span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
            {user?.role !== 'admin' && (
              <div className='flex flex-col gap-3 mt-2'>
                {cartMsg && (
                  <p className={`text-sm ${cartMsg.includes('!') ? 'text-green-600' : 'text-red-600'}`}>{cartMsg}</p>
                )}
                {wishMsg && (
                  <p className={`text-sm ${wishMsg.includes('!') ? 'text-green-600' : 'text-red-600'}`}>{wishMsg}</p>
                )}
                <button onClick={addToCartHandler} disabled={product.stock < 1} className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition'>
                  Add to Cart
                </button>
                <button onClick={addToWishlistHandler} className='w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold transition'>
                  Add to Wishlist
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
