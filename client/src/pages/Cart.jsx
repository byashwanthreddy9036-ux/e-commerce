import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import Navbar from '../components/Navbar'

const Cart = () => {
  const navigate = useNavigate()
  const [items, setitems] = useState([])
  const [loading, setloading] = useState(true)
  const [error, seterror] = useState('')
  const [success, setsuccess] = useState('')
  const [orderloading, setorderloading] = useState(false)

  const fetchCart = async () => {
    setloading(true)
    seterror('')
    try {
      const cartRes = await api.get('/cart/')
      const cartItems = cartRes.data.data.items
      if (cartItems.length === 0) {
        setitems([])
        setloading(false)
        return
      }
      const productDetails = await Promise.all(
        cartItems.map(item => api.get(`/product/${item.product}`))
      )
      setitems(cartItems.map((item, i) => ({
        product: productDetails[i].data.data,
        quantity: item.quantity
      })))
      setloading(false)
    } catch (err) {
      if (err.response?.status === 404) {
        setitems([])
        setloading(false)
      } else {
        seterror('Failed to load cart')
        setloading(false)
      }
    }
  }

  useEffect(() => { fetchCart() }, [])

  const increaseHandler = async (productId) => {
    seterror('')
    try {
      await api.post(`/cart/inc/${productId}`)
      fetchCart()
    } catch (err) {
      seterror(err.response?.data?.message || 'Failed to update cart')
    }
  }

  const decreaseHandler = async (productId) => {
    seterror('')
    try {
      await api.put(`/cart/dec/${productId}`)
      fetchCart()
    } catch (err) {
      seterror(err.response?.data?.message || 'Failed to update cart')
    }
  }

  const removeHandler = async (productId) => {
    seterror('')
    try {
      await api.delete(`/cart/${productId}`)
      fetchCart()
    } catch (err) {
      seterror('Failed to remove item')
    }
  }

  const clearCartHandler = async () => {
    seterror('')
    try {
      await api.delete('/cart/all')
      setitems([])
    } catch (err) {
      seterror('Failed to clear cart')
    }
  }

  const orderHandler = async () => {
    setorderloading(true)
    seterror('')
    setsuccess('')
    try {
      await api.post('/cart/order')
      setsuccess('Order placed successfully!')
      setitems([])
      setorderloading(false)
    } catch (err) {
      seterror(err.response?.data?.message || 'Failed to place order')
      setorderloading(false)
    }
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Your Cart</h2>
        {error && <div className='mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3'>{error}</div>}
        {success && <div className='mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 p-3'>{success}</div>}
        {loading ? (
          <div className='text-center py-20 text-gray-500'>Loading cart...</div>
        ) : items.length === 0 && !success ? (
          <div className='text-center py-20'>
            <p className='text-gray-500 mb-4'>Your cart is empty</p>
            <button onClick={() => navigate('/')} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition'>
              Browse Products
            </button>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {items.map(({ product, quantity }) => (
              <div key={product._id} className='bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4'>
                {product.image ? (
                  <img src={product.image} alt={product.name} className='w-20 h-20 object-cover rounded-xl flex-shrink-0' />
                ) : (
                  <div className='w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0' />
                )}
                <div className='flex-1 flex flex-col justify-between'>
                  <div>
                    <h3 className='font-semibold text-gray-800'>{product.name}</h3>
                    <p className='text-blue-600 font-bold mt-1'>₹{product.price}</p>
                  </div>
                  <div className='flex items-center gap-3 mt-2'>
                    <button onClick={() => decreaseHandler(product._id)} className='w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-bold'>-</button>
                    <span className='font-semibold text-gray-800 w-6 text-center'>{quantity}</span>
                    <button onClick={() => increaseHandler(product._id)} className='w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-bold'>+</button>
                    <button onClick={() => removeHandler(product._id)} className='ml-4 text-red-500 hover:text-red-700 text-sm font-medium transition'>Remove</button>
                  </div>
                </div>
                <div className='text-right flex-shrink-0'>
                  <p className='font-bold text-gray-800'>₹{product.price * quantity}</p>
                </div>
              </div>
            ))}
            {items.length > 0 && (
              <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-2'>
                <div className='flex justify-between items-center mb-4'>
                  <span className='text-lg font-semibold text-gray-700'>Total</span>
                  <span className='text-2xl font-bold text-blue-600'>₹{total}</span>
                </div>
                <div className='flex gap-3'>
                  <button onClick={clearCartHandler} className='flex-1 border border-gray-300 text-gray-600 hover:bg-gray-100 py-3 rounded-xl font-medium transition'>
                    Clear Cart
                  </button>
                  <button onClick={orderHandler} disabled={orderloading} className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition'>
                    {orderloading ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
