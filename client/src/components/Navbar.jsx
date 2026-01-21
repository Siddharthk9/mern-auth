import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate , Link  } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import EmailVerify from '../pages/EmailVerify'
import { toast } from 'react-toastify'
export default function Navbar() {

  const navigate = useNavigate()
  const {backend_url,userData,setuserData,setisLoggedin} = useContext(AppContext)

  const logout = async()=>{
    try {
       axios.defaults.withCredentials = true

       const {data} =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`)
       data.success && setisLoggedin(false)
       data.success && setuserData(false)
       navigate('/')

    } catch (error) {
      toast.error(error.message)
    }
  }

  
  const SendVerificationOtp=async()=>{
    try {
      console.log("SendVerify OTP")
       axios.defaults.withCredentials = true

       const{data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/send-verify-otp`)
       toast.success(data.message)

       if(data.success){
        navigate("/VerifyEmail")
       }
       else{
        toast.error(data.message)
       }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} className='w-28 sm:w-32'/>
      {
        userData?<div className='bg-black w-8 h-8 flex items-center justify-center rounded-full text-white relative group'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden  group-hover:block top-0 z-10 text-black rounded pt-10'>
            <ul className='list-none w-30 m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isAccountVerified &&  <li onClick={SendVerificationOtp} className='py-3 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>}
              <li onClick={logout} className='py-3 px-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
            </ul>
          </div>
          </div>:
         <button onClick={()=>navigate("/Login")}  className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100'>Login <img src={assets.arrow_icon} /></button>
      }
    </div>
  )
}
