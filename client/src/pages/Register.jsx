import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Store, User, Mail, Phone, Lock, UserPlus } from 'lucide-react'
import api from '../api/axios'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)
  const [error, seterror] = useState('')
  const [fieldErrors, setfieldErrors] = useState({})
  const [formData, setformData] = useState({ fullname: '', email: '', phone: '', password: '' })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setformData(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setfieldErrors(prev => ({ ...prev, [name]: null }))
  }

  const registerHandler = async (e) => {
    e.preventDefault()
    setloading(true)
    seterror('')
    setfieldErrors({})
    try {
      await api.post('/user/register', formData)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setfieldErrors(data.errors)
        seterror('Please fix the errors below')
      } else {
        seterror(data?.message || 'Something went wrong')
      }
      setloading(false)
    }
  }

  const Field = ({ icon: Icon, name, type = 'text', placeholder, hint }) => (
    <div>
      <div className='relative'>
        <Icon size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${fieldErrors[name] ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
        />
      </div>
      {hint && !fieldErrors[name] && <p className='text-gray-400 text-xs mt-1 ml-1'>{hint}</p>}
      {fieldErrors[name] && <p className='text-red-500 text-xs mt-1 ml-1'>{fieldErrors[name][0]}</p>}
    </div>
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-sm'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4 shadow-lg'>
            <Store size={26} className='text-white' />
          </div>
          <h1 className='text-2xl font-bold text-gray-800'>Create account</h1>
          <p className='text-gray-500 text-sm mt-1'>Join thousands of happy shoppers</p>
        </div>

        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-7'>
          {error && (
            <div className='mb-5 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm'>
              {error}
            </div>
          )}
          <form onChange={onChangeHandler} className='space-y-4'>
            <Field icon={User} name='fullname' placeholder='Full name' />
            <Field icon={Mail} name='email' type='email' placeholder='Email address' />
            <Field icon={Phone} name='phone' type='tel' placeholder='Phone number' hint='Include country code e.g. +919876543210' />
            <Field icon={Lock} name='password' type='password' placeholder='Password (min 6 characters)' />
            <button
              type='submit'
              onClick={registerHandler}
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition'
            >
              <UserPlus size={16} />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className='text-center text-gray-500 text-sm mt-5'>
            Have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:text-blue-800 font-semibold'>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
