import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import UserModel from './models/userModel.js'
import authRouter from './routes/authRoutes.js'
import userRoute from './routes/userRoute.js'

const app = express()
const port = process.env.PORT || 4000
connectDB()

const allowed = ['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:allowed,credentials:true}))

app.get('/',(req,res)=>{
    res.send("Server Running")
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRoute)


app.listen(port,()=>console.log(`Server running on ${port}`))