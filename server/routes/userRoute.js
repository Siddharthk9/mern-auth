import express from 'express'
import { userData } from '../controller/userController.js'
import userAuth from '../middleware/userAuth.js'

const userRoute = express.Router()

userRoute.get('/data',userAuth, userData)

export default userRoute