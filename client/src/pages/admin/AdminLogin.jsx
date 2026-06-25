import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [formData, setformData] = useState({ email: '', password: '' })

  const onChangeHandler = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value })
  }

  const loginHandler = async (e) => {
    e.preventDefault()
    setloading(true)
    seterror('')
    try {
      const response = await api.post('/admin/login', formData)
      login(response.data.data.admin, response.data.data.token)
      navigate('/admin/products')
    } catch (err) {
      seterror(err.response?.data?.message || 'Something went wrong')
      setloading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Admin Login</h1>
          <p className='text-gray-500 mt-2'>Access the admin dashboard</p>
        </div>
        {error && (
          <div className='mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3'>
            {error}
          </div>
        )}
        <form onChange={onChangeHandler} className='space-y-4'>
          <input type='email' name='email' placeholder='Admin Email' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-500' />
          <input type='password' name='password' placeholder='Password' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-500' />
          <button type='submit' onClick={loginHandler} disabled={loading} className='w-full bg-gray-800 hover:bg-gray-900 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
