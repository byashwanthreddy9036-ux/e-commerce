import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Edit3, Trash2, LogOut } from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [loading, setloading] = useState(true)
  const [saveloading, setsaveloading] = useState(false)
  const [deleteloading, setdeleteloading] = useState(false)
  const [error, seterror] = useState('')
  const [success, setsuccess] = useState('')
  const [profile, setprofile] = useState(null)
  const [fullname, setfullname] = useState('')
  const [confirmDelete, setconfirmDelete] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/details')
        setprofile(response.data.data)
        setfullname(response.data.data.fullname)
        setloading(false)
      } catch {
        seterror('Failed to load profile')
        setloading(false)
      }
    }
    fetchProfile()
  }, [])

  const updateHandler = async (e) => {
    e.preventDefault()
    setsaveloading(true)
    seterror('')
    setsuccess('')
    try {
      const response = await api.put('/user/details', { fullname })
      setprofile(response.data.data)
      setsuccess('Profile updated')
      setsaveloading(false)
    } catch (err) {
      seterror(err.response?.data?.message || 'Failed to update')
      setsaveloading(false)
    }
  }

  const deleteHandler = async () => {
    setdeleteloading(true)
    try {
      await api.delete('/user/details')
      logout()
      navigate('/register')
    } catch {
      seterror('Failed to delete account')
      setdeleteloading(false)
      setconfirmDelete(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-lg mx-auto px-4 py-10'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Profile</h2>

        {error && <div className='mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm'>{error}</div>}
        {success && <div className='mb-4 rounded-xl bg-green-50 border border-green-100 text-green-600 px-4 py-3 text-sm'>{success}</div>}

        {loading ? (
          <div className='bg-white rounded-3xl border border-gray-100 p-8 animate-pulse space-y-4'>
            <div className='h-4 bg-gray-100 rounded w-1/3' />
            <div className='h-4 bg-gray-100 rounded w-1/2' />
            <div className='h-10 bg-gray-100 rounded-xl' />
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='bg-white rounded-2xl border border-gray-100 p-6 space-y-4'>
              <div className='flex items-center gap-3 text-gray-600'>
                <div className='w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <Mail size={16} className='text-gray-400' />
                </div>
                <div>
                  <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Email</p>
                  <p className='font-medium text-gray-800 text-sm'>{profile?.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <div className='w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <Phone size={16} className='text-gray-400' />
                </div>
                <div>
                  <p className='text-xs text-gray-400 font-medium uppercase tracking-wide'>Phone</p>
                  <p className='font-medium text-gray-800 text-sm'>{profile?.phone}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Edit3 size={16} className='text-gray-400' />
                <p className='font-semibold text-gray-700 text-sm'>Edit Name</p>
              </div>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <User size={15} className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <input
                    type='text'
                    value={fullname}
                    onChange={(e) => setfullname(e.target.value)}
                    className='w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
                <button
                  onClick={updateHandler}
                  disabled={saveloading}
                  className='px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition'
                >
                  {saveloading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className='bg-white rounded-2xl border border-gray-100 p-6'>
              <div className='flex items-center gap-2 mb-1'>
                <Trash2 size={16} className='text-red-400' />
                <p className='font-semibold text-gray-700 text-sm'>Danger Zone</p>
              </div>
              <p className='text-xs text-gray-400 mb-4'>Permanently deletes your account and all associated data.</p>
              {confirmDelete ? (
                <div className='flex gap-2'>
                  <button onClick={deleteHandler} disabled={deleteloading} className='flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold text-sm transition'>
                    {deleteloading ? 'Deleting...' : 'Yes, delete my account'}
                  </button>
                  <button onClick={() => setconfirmDelete(false)} className='flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm transition'>
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setconfirmDelete(true)} className='w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl font-semibold text-sm transition'>
                  Delete Account
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
