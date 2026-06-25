import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'

const emptyForm = { name: '', description: '', price: '', category: '', stock: '', image: '', brand: '' }

const AdminProducts = () => {
  const [products, setproducts] = useState([])
  const [loading, setloading] = useState(true)
  const [error, seterror] = useState('')
  const [success, setsuccess] = useState('')
  const [formloading, setformloading] = useState(false)
  const [showForm, setshowForm] = useState(false)
  const [editId, seteditId] = useState(null)
  const [formData, setformData] = useState(emptyForm)
  const [page, setpage] = useState(1)
  const [pagination, setpagination] = useState(null)
  const [confirmDeleteId, setconfirmDeleteId] = useState(null)

  const fetchProducts = async (pageNum) => {
    setloading(true)
    seterror('')
    try {
      const response = await api.get(`/product/?page=${pageNum}&limit=10`)
      setproducts(response.data.data)
      setpagination(response.data.pagination)
      setloading(false)
    } catch {
      seterror('Failed to load products')
      setloading(false)
    }
  }

  useEffect(() => { fetchProducts(page) }, [page])

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setformData(prev => ({ ...prev, [name]: value }))
  }

  const openCreateForm = () => {
    setformData(emptyForm)
    seteditId(null)
    setshowForm(true)
    seterror('')
    setsuccess('')
  }

  const openEditForm = (product) => {
    setformData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      image: product.image || '',
      brand: product.brand || ''
    })
    seteditId(product._id)
    setshowForm(true)
    seterror('')
    setsuccess('')
  }

  const cancelForm = () => {
    setshowForm(false)
    seteditId(null)
    setformData(emptyForm)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setformloading(true)
    seterror('')
    setsuccess('')
    try {
      if (editId) {
        const updatePayload = {
          id: editId,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          stock: Number(formData.stock),
        }
        if (formData.image) updatePayload.image = formData.image
        if (formData.brand) updatePayload.brand = formData.brand
        await api.put('/product/', updatePayload)
        setsuccess('Product updated')
      } else {
        const createPayload = {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          category: formData.category,
          stock: Number(formData.stock),
        }
        if (formData.image) createPayload.image = formData.image
        if (formData.brand) createPayload.brand = formData.brand
        await api.post('/product/', createPayload)
        setsuccess('Product created')
      }
      cancelForm()
      fetchProducts(page)
      setformloading(false)
    } catch (err) {
      seterror(err.response?.data?.message || 'Something went wrong')
      setformloading(false)
    }
  }

  const deleteHandler = async (id) => {
    seterror('')
    setsuccess('')
    try {
      await api.delete(`/product/${id}`)
      setsuccess('Product deleted')
      setconfirmDeleteId(null)
      fetchProducts(page)
    } catch (err) {
      seterror(err.response?.data?.message || 'Failed to delete product')
      setconfirmDeleteId(null)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Products</h2>
          <button onClick={openCreateForm} className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium transition'>
            + Add Product
          </button>
        </div>
        {error && <div className='mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3'>{error}</div>}
        {success && <div className='mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 p-3'>{success}</div>}

        {showForm && (
          <div className='bg-white rounded-3xl shadow-xl p-8 mb-6'>
            <h3 className='text-xl font-bold text-gray-800 mb-6'>{editId ? 'Edit Product' : 'New Product'}</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {!editId && (
                <input type='text' name='name' placeholder='Product Name' value={formData.name} onChange={onChangeHandler} className='border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
              )}
              <input type='text' name='category' placeholder='Category' value={formData.category} onChange={onChangeHandler} className='border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
              <input type='number' name='price' placeholder='Price' value={formData.price} onChange={onChangeHandler} className='border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
              <input type='number' name='stock' placeholder='Stock' value={formData.stock} onChange={onChangeHandler} className='border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
              <input type='text' name='brand' placeholder='Brand (optional)' value={formData.brand} onChange={onChangeHandler} className='border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
              <input type='url' name='image' placeholder='Image URL (optional)' value={formData.image} onChange={onChangeHandler} className='border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
              <textarea name='description' placeholder='Description' value={formData.description} rows={3} onChange={onChangeHandler} className='md:col-span-2 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none' />
              <div className='md:col-span-2 flex gap-3'>
                <button onClick={submitHandler} disabled={formloading} className='flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition'>
                  {formloading ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}
                </button>
                <button type='button' onClick={cancelForm} className='flex-1 border border-gray-300 text-gray-600 hover:bg-gray-100 py-3 rounded-xl font-semibold transition'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className='text-center py-20 text-gray-500'>Loading products...</div>
        ) : products.length === 0 ? (
          <div className='text-center py-20 text-gray-500'>No products found</div>
        ) : (
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='text-left px-4 py-3 text-sm font-semibold text-gray-600'>Name</th>
                  <th className='text-left px-4 py-3 text-sm font-semibold text-gray-600'>Category</th>
                  <th className='text-left px-4 py-3 text-sm font-semibold text-gray-600'>Price</th>
                  <th className='text-left px-4 py-3 text-sm font-semibold text-gray-600'>Stock</th>
                  <th className='text-left px-4 py-3 text-sm font-semibold text-gray-600'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {products.map(product => (
                  <tr key={product._id} className='hover:bg-gray-50 transition'>
                    <td className='px-4 py-3 font-medium text-gray-800'>{product.name}</td>
                    <td className='px-4 py-3 text-gray-500 capitalize'>{product.category}</td>
                    <td className='px-4 py-3 text-blue-600 font-semibold'>₹{product.price}</td>
                    <td className='px-4 py-3'>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      {confirmDeleteId === product._id ? (
                        <div className='flex items-center gap-2'>
                          <span className='text-xs text-gray-500'>Sure?</span>
                          <button onClick={() => deleteHandler(product._id)} className='text-xs text-red-600 hover:text-red-800 font-semibold transition'>Yes</button>
                          <button onClick={() => setconfirmDeleteId(null)} className='text-xs text-gray-500 hover:text-gray-700 font-semibold transition'>No</button>
                        </div>
                      ) : (
                        <div className='flex gap-3'>
                          <button onClick={() => openEditForm(product)} className='text-blue-600 hover:text-blue-800 text-sm font-medium transition'>Edit</button>
                          <button onClick={() => setconfirmDeleteId(product._id)} className='text-red-500 hover:text-red-700 text-sm font-medium transition'>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className='flex justify-center gap-2 mt-6'>
            <button onClick={() => setpage(p => p - 1)} disabled={page === 1} className='px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition'>Prev</button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setpage(p)} className={`px-4 py-2 rounded-xl border transition ${p === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{p}</button>
            ))}
            <button onClick={() => setpage(p => p + 1)} disabled={page === pagination.pages} className='px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition'>Next</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
