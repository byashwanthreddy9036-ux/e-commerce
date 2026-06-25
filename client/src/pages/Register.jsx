import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [formData, setformData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: ''
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setformData(prev => ({ ...prev, [name]: value }))
  }

  const registerHandler = async (e) => {
    e.preventDefault()
    setloading(true)
    seterror('')
    try {
      await api.post('/user/register', formData)
      navigate('/login')
    } catch (err) {
      seterror(err.response?.data?.message || 'Something went wrong')
      setloading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-3xl shadow-xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>Create Account</h1>
          <p className='text-gray-500 mt-2'>Register to get started</p>
        </div>
        {error && (
          <div className='mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3'>
            {error}
          </div>
        )}
        <form onChange={onChangeHandler} className='space-y-4'>
          <input type='text' name='fullname' placeholder='Full Name' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
          <input type='email' name='email' placeholder='Email' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
          <input type='tel' name='phone' placeholder='Phone (+919876543210)' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
          <input type='password' name='password' placeholder='Password' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
          <button type='submit' onClick={registerHandler} disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50'>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className='text-center text-gray-500 text-sm mt-4'>
          Have an account?{' '}
          <Link to='/login' className='text-blue-600 hover:text-blue-800 font-medium'>Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
