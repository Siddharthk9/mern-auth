import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import RestPassword from './pages/RestPassword'
import EmailVerify from './pages/EmailVerify'
import Login from './pages/Login'
import { ToastContainer} from 'react-toastify'

export default function App() {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/ResetPassword' element={<RestPassword/>}/>
        <Route path='/VerifyEmail' element={<EmailVerify/>}/>
        <Route path='/Login' element={<Login/>}/>
      </Routes>
    </div>
  )
}
