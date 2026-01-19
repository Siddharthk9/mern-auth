import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

export default function RestPassword() {


  const navigate = useNavigate()
  const [email, setemail] = useState('')
  const [NewPassword, setNewPassword] = useState('')
  const [isEmailSent,setisEmailSent] = useState('')
  const [otp,setotp] = useState(null)
  const [isOtpSubmitted,setisOtpSubmitted]=useState(false)

  //  axios.defaults.withCredentials=true
  const {backend_url,isLoggedin, userData,getUserData} =useContext(AppContext)

  const inputRefs = React.useRef([])

  const handleInput =(e,index)=>{
      if(e.target.value.length>0 && index< inputRefs.current.length - 1){
        inputRefs.current[index+1].focus()
      }
  }

  const handleKeyDown =(e,index)=>{
      if(e.key==='Backspace' && e.target.value==='' && index>0){
        inputRefs.current[index-1].focus()
      }
  }

  const handlePaste =(e)=>{
    const paste = e.clipboardData.getData('text')
    const PasteArray = paste.split('')
    PasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char
      }
    })
  }

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedin,userData])

  const onSubmitEmail = async(e)=>{
    e.preventDefault()
    try {
      const {data} = await axios.post(backend_url+'/api/auth/send-reset-otp',{email})
      data.success ? toast.success(data.message):toast.error(data.message)
      data.success && setisEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  } 

  const onSubmitOtp = async(e)=>{
    e.preventDefault()
    const otpArray = inputRefs.current.map(e => e.value)
      setotp(otpArray.join(''))
      setisOtpSubmitted(true)
  }

  const onSubmitPassword = async(e)=>{
    e.preventDefault()
    try {
      console.log(email,otp,NewPassword)
      const {data} =await axios.post(backend_url+'/api/auth/reset-password',{email,otp,newPassword:NewPassword})
      data.success?toast.success(data.message):toast.error(data.message)
      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (

    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-200'>
     <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />

      {!isEmailSent &&

      <form onSubmit={onSubmitEmail} action="" className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
         <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter your Registered Email address</p>
       <div className='mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.mail_icon} alt=""  className='w-4 h-4 mt-1'/>
        <input type="email" placeholder='Email Id' value={email} onChange={e=>setemail(e.target.value)} required className='transparent outline-none ml-1 text-white' />
       </div>
       <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
      </form>

       }


{!isOtpSubmitted && isEmailSent &&
    <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter the 6 digit code sent to your email id</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
                {Array(6).fill(0).map((_,index)=>(
                  <input type="text" maxLength={1} key={index} required 
                  ref={e=> inputRefs.current[index]=e}
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                  onInput={(e)=>handleInput(e,index)}
                  onKeyDown={(e)=>handleKeyDown(e,index)}
                  />
                ))}
          </div>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
      </form>

      }

      {isEmailSent && isOtpSubmitted &&

      <form onSubmit={onSubmitPassword} action="" className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
         <h1 className='text-white text-2xl font-semibold text-center mb-4'>Enter New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter New Password Below</p>
       <div className='mb-4 flex item-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
        <img src={assets.lock_icon} alt=""  className='w-4 h-4 mt-1'/>
        <input type="password" placeholder='Password' value={NewPassword} onChange={e=>setNewPassword(e.target.value)} required className='transparent outline-none ml-1 text-white' />
       </div>
       <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
      </form>

      }


    </div>
  )
}
