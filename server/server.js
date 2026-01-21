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

const allowed = ['http://localhost:5173',"https://mern-auth-5-client.onrender.com","https://mern-auth-5-zppf.onrender.com"]

app.use(express.json())
app.use(cookieParser())
// app.use(cors({origin:allowed,credentials:true}))

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}))

app.options("*", cors());

app.get('/',(req,res)=>{
    res.send("Server Running")
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRoute)


app.listen(port,()=>console.log(`Server running on ${port}`))
