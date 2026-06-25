import { useState, useEffect } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'

const Home = () => {
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
    } catch (err) {
      seterror('Failed to load products')
      setloading(false)
    }
  }

  useEffect(() => {
    fetchProducts(page)
  }, [page])

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>All Products</h2>
        {loading ? (
          <div className='text-center py-20 text-gray-500'>Loading products...</div>
        ) : error ? (
          <div className='text-center py-20 text-red-500'>{error}</div>
        ) : products.length === 0 ? (
          <div className='text-center py-20 text-gray-500'>No products found</div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        {pagination && pagination.pages > 1 && (
          <div className='flex justify-center gap-2 mt-10'>
            <button
              onClick={() => setpage(p => p - 1)}
              disabled={page === 1}
              className='px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition'
            >
              Prev
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setpage(p)}
                className={`px-4 py-2 rounded-xl border transition ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setpage(p => p + 1)}
              disabled={page === pagination.pages}
              className='px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition'
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
