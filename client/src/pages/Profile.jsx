import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

  useEffect(() => {
    const fetchProfile = async () => {
      setloading(true)
      seterror('')
      try {
        const response = await api.get('/user/details')
        setprofile(response.data.data)
        setfullname(response.data.data.fullname)
        setloading(false)
      } catch (err) {
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
      setsuccess('Profile updated successfully')
      setsaveloading(false)
    } catch (err) {
      seterror(err.response?.data?.message || 'Failed to update profile')
      setsaveloading(false)
    }
  }

  const deleteHandler = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    setdeleteloading(true)
    seterror('')
    try {
      await api.delete('/user/details')
      logout()
      navigate('/register')
    } catch (err) {
      seterror('Failed to delete account')
      setdeleteloading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='max-w-lg mx-auto px-4 py-10'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Your Profile</h2>
        {error && <div className='mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3'>{error}</div>}
        {success && <div className='mb-4 rounded-lg bg-green-100 border border-green-300 text-green-700 p-3'>{success}</div>}
        {loading ? (
          <div className='text-center py-20 text-gray-500'>Loading profile...</div>
        ) : (
          <div className='bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-6'>
            <div>
              <p className='text-sm text-gray-500 mb-1'>Email</p>
              <p className='font-medium text-gray-800'>{profile?.email}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500 mb-1'>Phone</p>
              <p className='font-medium text-gray-800'>{profile?.phone}</p>
            </div>
            <form className='space-y-4'>
              <div>
                <label className='text-sm text-gray-500 mb-1 block'>Full Name</label>
                <input
                  type='text'
                  value={fullname}
                  onChange={(e) => setfullname(e.target.value)}
                  className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <button type='submit' onClick={updateHandler} disabled={saveloading} className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition'>
                {saveloading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
            <hr className='border-gray-200' />
            <div>
              <p className='text-sm text-gray-500 mb-3'>Danger Zone</p>
              <button onClick={deleteHandler} disabled={deleteloading} className='w-full border border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-50 py-3 rounded-xl font-semibold transition'>
                {deleteloading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
