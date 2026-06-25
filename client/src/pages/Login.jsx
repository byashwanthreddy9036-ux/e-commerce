import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Store, Mail, Lock, LogIn } from 'lucide-react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [formData, setformData] = useState({ email: '', password: '' })

  if (user) return <Navigate to={user.role === 'admin' ? '/admin/products' : '/'} />

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setformData(prev => ({ ...prev, [name]: value }))
  }

  const loginHandler = async (e) => {
    e.preventDefault()
    setloading(true)
    seterror('')
    try {
      const res = await api.post('/user/login', formData)
      login(res.data.data.user, res.data.data.token)
      navigate('/')
    } catch {
      try {
        const res = await api.post('/admin/login', formData)
        login(res.data.data.admin, res.data.data.token)
        navigate('/admin/products')
      } catch (adminErr) {
        seterror(adminErr.response?.data?.message || 'Invalid credentials')
        setloading(false)
      }
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-sm'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg'>
            <Store size={26} className='text-white' />
          </div>
          <h1 className='text-2xl font-bold text-gray-800'>Welcome back</h1>
          <p className='text-gray-500 text-sm mt-1'>Sign in to your account</p>
        </div>

        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-7'>
          {error && (
            <div className='mb-5 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm'>
              {error}
            </div>
          )}
          <form onChange={onChangeHandler} className='space-y-4'>
            <div className='relative'>
              <Mail size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type='email'
                name='email'
                placeholder='Email address'
                className='w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <div className='relative'>
              <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
              <input
                type='password'
                name='password'
                placeholder='Password'
                className='w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <button
              type='submit'
              onClick={loginHandler}
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition'
            >
              <LogIn size={16} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className='text-center text-gray-500 text-sm mt-5'>
            No account?{' '}
            <Link to='/register' className='text-blue-600 hover:text-blue-800 font-semibold'>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
