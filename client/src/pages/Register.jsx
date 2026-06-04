// import { useState } from 'react'
// import api from '../api/axios.js'
// import { useNavigate, Link } from 'react-router-dom'

// const Register = () => {
//     const navigate = useNavigate()
//   const [loading, setloading] = useState(false)
//   const [error, seterror] = useState('')
//   const [success, setsuccess] = useState('')
//   const [step, setstep] = useState('form') // form, otp, success
//   const [formData, setformData] = useState({
//     fullname: '',
//     email: '',
//     password: ''
//   })
//   const onChangeHandler = (e) => {
//     setformData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }
//   const [otp, setotp] = useState('')
//   const registerHandler = async (e) => {
//     e.preventDefault()
//     setloading(true)
//     seterror('')
//     setsuccess('')
//     try {
//       const response = await api.post('/user/register', formData)
//       console.log('hello');
//       setsuccess(response.data.message)
//       setloading(false)
//       setstep('otp')
//     } catch (error) {
//       console.log(error);
//       seterror(error.response.data.message)
//       setloading(false)
//     }
//   }
//   const verifyOTPHandler = async () => {
//     setloading(true)
//     seterror('')
//     setsuccess('')
//     try {
//       const response = await api.post('/auth/register/verify-otp', { email: formData.email, otp: otp })
//       setsuccess(response.data.message)
//       setloading(false)
//       setstep('success')
//        if(response.data.success){
//         navigate('/login')
//       }
//     } catch (error) {
//       seterror(error.response.data.message)
//       setloading(false)
//     }
//   }

//   const resendOTPHandler = async () => {
//     setloading(true)
//     seterror('')
//     setsuccess('')
//     try {
//       console.log(formData.email);
//       const response = await api.post('/auth/register/resend-otp', { email: formData.email })
//       setsuccess(response.data.message)
//       setloading(false)
//     } catch (error) {
//       seterror(error.response.data.message)
//       setloading(false)
//     }
//   }

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
//       <div className='w-full max-w-md bg-white rounded-3xl shadow-xl p-8'>

//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Create Account
//           </h1>
//           <p className="text-gray-500 mt-2">
//             {step === 'form'
//               ? 'Register to get started'
//               : 'Verify your email address'}
//           </p>
//         </div>
//         {error && <div className='mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 p-3'>
//           {error}
//         </div>}

//         {
//           step === 'form' ?
//             <div>
//               <form onChange={onChangeHandler} className='space-y-4'>
//                 <input type="text" name='fullname' placeholder='Name' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
//                 <input type="email" name='email' placeholder='Email' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
//                 <input type="tel" name='phone' placeholder='Phone' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
//                 <input type="password" name='password' placeholder='Password' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500' />
//                 <button type='submit' onClick={registerHandler} className='w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50'>Register</button>
//               </form>
//               <p className="text-center text-gray-500 text-sm mt-2">
//                 Have an account?{' '}
//                 <Link to="/login" className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium">
//                   Login
//                 </Link>
//                 </p>
//             </div>
//             :
//             <div className="space-y-4">

//               <div className="text-center">
//                 <p className="text-gray-600">
//                   Enter the OTP sent to
//                 </p>
//                 <p className="font-semibold text-gray-800">
//                   {formData.email}
//                 </p>
//               </div>
//               <div>
//                 <input type="number" placeholder='123456' value={otp} onChange={(e) => setotp(e.target.value)} className='w-full text-center text-2xl tracking-[8px] border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500' />
//                 <button onClick={verifyOTPHandler} className='w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold disabled:opacity-50 my-4'>Verify OTP</button>
//                 <button onClick={resendOTPHandler} className='w-full text-blue-600 font-medium hover:text-blue-800 '>Resend Otp</button>
//               </div>
//             </div>
//         }
//       </div>

//     </div>
//   )
// }

// export default Register