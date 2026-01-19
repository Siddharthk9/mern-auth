import express from 'express'
import { login, logout, register, sendVerifiyOTP, verifyEmail,isAuthenticated,sendResetOtp,ResetPassword } from '../controller/authController.js'
import userAuth from '../middleware/userAuth.js'
const authRouter = express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/send-verify-otp',userAuth,sendVerifiyOTP)
authRouter.post('/send-verify-account',userAuth,verifyEmail)
authRouter.get('/is-auth',userAuth,isAuthenticated)
authRouter.post('/send-reset-otp',sendResetOtp)
authRouter.post('/reset-password',ResetPassword)

export default authRouter