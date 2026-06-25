import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()
  const [products, setproducts] = useState([])
  const [loading, setloading] = useState(true)
  const [error, seterror] = useState('')
  const [page, setpage] = useState(1)
  const [pagination, setpagination] = useState(null)

  const fetchProducts = async (pageNum) => {
    setloading(true)
    seterror('')
    try {
      const response = await api.get(`/product/?page=${pageNum}&limit=12`)
      setproducts(response.data.data)
      setpagination(response.data.pagination)
      setloading(false)
    } catch {
      seterror('Failed to load products')
      setloading(false)
    }
  }

  useEffect(() => { fetchProducts(page) }, [page])

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      {!user && (
        <div className='bg-gradient-to-br from-blue-600 to-indigo-700 text-white'>
          <div className='max-w-6xl mx-auto px-4 py-16 text-center'>
            <h1 className='text-4xl sm:text-5xl font-bold mb-4 leading-tight'>Everything you need,<br />delivered fast.</h1>
            <p className='text-blue-100 text-lg mb-8 max-w-md mx-auto'>Thousands of products across all categories at prices that make sense.</p>
            <a href='/register' className='inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-2xl hover:bg-blue-50 transition shadow-lg'>
              Shop Now
            </a>
          </div>
        </div>
      )}

      <div className='max-w-6xl mx-auto px-4 py-10'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>All Products</h2>
            {pagination && (
              <p className='text-sm text-gray-400 mt-1'>{pagination.total} items</p>
            )}
          </div>
        </div>

        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse'>
                <div className='w-full h-52 bg-gray-100' />
                <div className='p-4 space-y-3'>
                  <div className='h-4 bg-gray-100 rounded-lg w-3/4' />
                  <div className='h-4 bg-gray-100 rounded-lg w-1/2' />
                  <div className='h-9 bg-gray-100 rounded-xl' />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className='text-center py-20 text-red-500'>{error}</div>
        ) : products.length === 0 ? (
          <div className='text-center py-20 text-gray-400'>No products found</div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className='flex justify-center items-center gap-2 mt-10'>
            <button
              onClick={() => setpage(p => p - 1)}
              disabled={page === 1}
              className='p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition'
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setpage(p)}
                className={`w-9 h-9 rounded-xl border text-sm font-medium transition ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setpage(p => p + 1)}
              disabled={page === pagination.pages}
              className='p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition'
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
