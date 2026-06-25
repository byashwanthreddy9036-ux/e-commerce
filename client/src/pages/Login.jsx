import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, user } = useAuth()

  if (user) return <Navigate to='/' />
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [formData, setformData] = useState({ email: '', password: '' })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setformData(prev => ({ ...prev, [name]: value }))
  }

  const loginHandler = async (e) => {
    e.preventDefault()
    setloading(true)
    seterror('')
    try {
      const response = await api.post('/user/login', formData)
      login(response.data.data.user, response.data.data.token)
      navigate('/')
    } catch (err) {
      seterror(err.response?.data?.message || 'Something went wrong')
      setloading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Welcome Back</h1>
          <p className='text-gray-500 mt-2'>Login to your account</p>
        </div>
        {error && (
          <div className='mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3'>
            {error}
          </div>
        )}
        <form onChange={onChangeHandler} className='space-y-4'>
          <input type='email' name='email' placeholder='Email' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
          <input type='password' name='password' placeholder='Password' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
          <button type='submit' onClick={loginHandler} disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50'>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='text-center text-gray-500 text-sm mt-4'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-600 hover:text-blue-800 font-medium'>Register</Link>
        </p>
        <p className='text-center text-gray-400 text-xs mt-3'>
          Admin?{' '}
          <Link to='/admin/login' className='text-gray-500 hover:text-gray-700 font-medium'>Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
