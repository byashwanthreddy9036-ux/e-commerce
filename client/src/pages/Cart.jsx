import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
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
      if (cartItems.length === 0) { setitems([]); setloading(false); return }
      const productDetails = await Promise.all(cartItems.map(item => api.get(`/product/${item.product}`)))
      setitems(cartItems.map((item, i) => ({ product: productDetails[i].data.data, quantity: item.quantity })))
      setloading(false)
    } catch (err) {
      if (err.response?.status === 404) { setitems([]); setloading(false) }
      else { seterror('Failed to load cart'); setloading(false) }
    }
  }

  useEffect(() => { fetchCart() }, [])

  const increaseHandler = async (productId) => {
    try { await api.post(`/cart/inc/${productId}`); fetchCart() }
    catch (err) { seterror(err.response?.data?.message || 'Failed') }
  }

  const decreaseHandler = async (productId) => {
    try { await api.put(`/cart/dec/${productId}`); fetchCart() }
    catch (err) { seterror(err.response?.data?.message || 'Failed') }
  }

  const removeHandler = async (productId) => {
    try { await api.delete(`/cart/${productId}`); fetchCart() }
    catch { seterror('Failed to remove item') }
  }

  const clearCartHandler = async () => {
    try { await api.delete('/cart/all'); setitems([]) }
    catch { seterror('Failed to clear cart') }
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
      <div className='max-w-4xl mx-auto px-4 py-10'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Your Cart</h2>

        {error && <div className='mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm'>{error}</div>}
        {success && <div className='mb-4 rounded-xl bg-green-50 border border-green-100 text-green-600 px-4 py-3 text-sm'>{success}</div>}

        {loading ? (
          <div className='space-y-4'>
            {[1, 2, 3].map(i => (
              <div key={i} className='bg-white rounded-2xl p-4 flex gap-4 animate-pulse'>
                <div className='w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 bg-gray-100 rounded w-1/2' />
                  <div className='h-4 bg-gray-100 rounded w-1/4' />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 && !success ? (
          <div className='text-center py-24'>
            <ShoppingBag size={48} className='mx-auto text-gray-200 mb-4' />
            <p className='text-gray-400 font-medium mb-6'>Your cart is empty</p>
            <button onClick={() => navigate('/')} className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition'>
              Browse Products
            </button>
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='flex-1 space-y-3'>
              {items.map(({ product, quantity }) => (
                <div key={product._id} className='bg-white rounded-2xl border border-gray-100 p-4 flex gap-4'>
                  <div
                    onClick={() => navigate(`/product/${product._id}`)}
                    className='flex-shrink-0 cursor-pointer'
                  >
                    {product.image ? (
                      <img src={product.image} alt={product.name} className='w-20 h-20 object-cover rounded-xl' />
                    ) : (
                      <div className='w-20 h-20 bg-gray-100 rounded-xl' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-gray-800 truncate'>{product.name}</h3>
                    <p className='text-blue-600 font-bold mt-1'>₹{product.price.toLocaleString()}</p>
                    <div className='flex items-center gap-2 mt-3'>
                      <button onClick={() => decreaseHandler(product._id)} className='w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition'>
                        <Minus size={14} />
                      </button>
                      <span className='w-8 text-center font-semibold text-gray-800'>{quantity}</span>
                      <button onClick={() => increaseHandler(product._id)} className='w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition'>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className='flex flex-col items-end justify-between flex-shrink-0'>
                    <button onClick={() => removeHandler(product._id)} className='text-gray-300 hover:text-red-400 transition'>
                      <Trash2 size={16} />
                    </button>
                    <span className='font-bold text-gray-700'>₹{(product.price * quantity).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {items.length > 0 && (
                <button onClick={clearCartHandler} className='text-sm text-gray-400 hover:text-red-500 transition font-medium'>
                  Clear cart
                </button>
              )}
            </div>

            {items.length > 0 && (
              <div className='lg:w-72 flex-shrink-0'>
                <div className='bg-white rounded-2xl border border-gray-100 p-6 sticky top-24'>
                  <h3 className='font-bold text-gray-800 mb-4'>Order Summary</h3>
                  <div className='space-y-2 mb-4'>
                    {items.map(({ product, quantity }) => (
                      <div key={product._id} className='flex justify-between text-sm text-gray-500'>
                        <span className='truncate mr-2'>{product.name} × {quantity}</span>
                        <span className='flex-shrink-0'>₹{(product.price * quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className='border-t border-gray-100 pt-4 mb-6'>
                    <div className='flex justify-between font-bold text-gray-800'>
                      <span>Total</span>
                      <span className='text-blue-600 text-lg'>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={orderHandler}
                    disabled={orderloading}
                    className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition'
                  >
                    {orderloading ? 'Placing Order...' : <>Place Order <ArrowRight size={16} /></>}
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
