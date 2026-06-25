import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
      if (productIds.length === 0) {
        setproducts([])
        setloading(false)
        return
      }
      const productDetails = await Promise.all(
        productIds.map(id => api.get(`/product/${id}`))
      )
      setproducts(productDetails.map(res => res.data.data))
      setloading(false)
    } catch (err) {
      if (err.response?.status === 404) {
        setproducts([])
        setloading(false)
      } else {
        seterror('Failed to load wishlist')
        setloading(false)
      }
    }
  }

  useEffect(() => { fetchWishlist() }, [])

  const removeHandler = async (productId) => {
    seterror('')
    setsuccess('')
    try {
      await api.delete(`/wishlist/${productId}`)
      fetchWishlist()
    } catch (err) {
      seterror('Failed to remove item')
    }
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
    seterror('')
    setsuccess('')
    try {
      await api.delete('/wishlist/delete-all')
      setproducts([])
    } catch (err) {
      seterror('Failed to clear wishlist')
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Your Wishlist</h2>
          {products.length > 0 && (
            <button onClick={clearWishlistHandler} className='text-sm text-red-500 hover:text-red-700 font-medium transition'>
              Clear All
            </button>
          )}
        </div>
        {error && <div className='mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3'>{error}</div>}
        {success && <div className='mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 p-3'>{success}</div>}
        {loading ? (
          <div className='text-center py-20 text-gray-500'>Loading wishlist...</div>
        ) : products.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-gray-500 mb-4'>Your wishlist is empty</p>
            <button onClick={() => navigate('/')} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition'>
              Browse Products
            </button>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {products.map(product => (
              <div key={product._id} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4'>
                <div onClick={() => navigate(`/product/${product._id}`)} className='cursor-pointer'>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className='w-full h-40 object-cover rounded-xl' />
                  ) : (
                    <div className='w-full h-40 bg-gray-100 rounded-xl' />
                  )}
                  <h3 className='font-semibold text-gray-800 mt-3'>{product.name}</h3>
                  <p className='text-blue-600 font-bold mt-1'>₹{product.price}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className='flex gap-2 mt-3'>
                  <button onClick={() => moveToCartHandler(product._id)} disabled={product.stock < 1} className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-xl text-sm font-medium transition'>
                    Move to Cart
                  </button>
                  <button onClick={() => removeHandler(product._id)} className='flex-1 border border-red-400 text-red-500 hover:bg-red-50 py-2 rounded-xl text-sm font-medium transition'>
                    Remove
                  </button>
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
