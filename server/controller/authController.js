import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../models/userModel.js"
import transporter from "../config/nodemailer.js"

export const register = async(req,res) =>{
    const {name,email,password} = req.body

    if (!name || !email || !password){
        return res.status(400).json({success:false , message: 'Missing Details'})
    }

    try {
        const existingUser = await UserModel.findOne({email})

        if(existingUser){
            return res.status(400).json({success:false,message:'User already exist'})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = new UserModel({name,email,password:hashedPassword})
        await user.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        // Study this Cookiee Section in detail

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge:7*24*60*60*1000,

        })

         const mailOption ={
            from: process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to Sid's Web",
            text:`Welcome to Sid's Web.Your account has been created with email id :${email}`
        }

        await transporter.sendMail(mailOption)


        res.status(201).json({ success: true, message: "User registered successfully" })

    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body

    if(!email||!password){
       return res.status(400).json({success:false,message:"Email and password required"})
    }

    try {
        const user = await UserModel.findOne({email})

        if (!user){
          return  res.status(401).json({success:false,message:"Email does not Exist"})
        }

        const IsMatched = await bcrypt.compare(password,user.password)

        if (!IsMatched){
          return  res.status(401).json({success:false,message:"Invalid email or password"})
        }

         const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        // Study this Cookiee Section in detail

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge:7*24*60*60*1000,

        })

       
        res.json({ success: true, message: "Login successful" })

    } catch (error) {
         return res.status(500).json({success:false,message:error.message})
    }

} 

export const logout = async (req,res) =>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })
        res.status(200).json({success:true,message:"Logout"})
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}

export const sendVerifiyOTP = async(req,res)=>{
    try {
        const {userID} = req.body
        const user = await UserModel.findById(userID)

        if(user.isAccountVerified){
           return res.json({success:false,message:"Account already verified"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp
        user.verifyOtpExpiresAt= Date.now() + 24*60*60*1000

        await user.save()

         const mailOption ={
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Account Verification OTP",
            text:`Your OTP is:${otp}.Expires within 24 hrs`
        }

        await transporter.sendMail(mailOption)
        res.json({success:true,message:"Verification OTP sent on Email"})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


export const verifyEmail =async(req,res)=>{

    console.log("BODY:", req.body)

    const{userID,otp}= req.body

    if(!userID || !otp){
        return res.json({success:false,message:'Missing Details'})
    }
    try {
        const user = await UserModel.findById(userID)

        if(!user){
            return res.json({success:false,message:"User Not Found"})
        }

        if( user.verifyOtp === "" || user.verifyOtp.toString() !== otp.toString()){
            return res.json({success:false,message:"Invalid OTP"})
        }

        if(user.verifyOtpExpiresAt< Date.now()){
            return res.json({success:false,message:'OTP Expired'})
        }

        user.isAccountVerified=true
        user.verifyOtp=''
        user.verifyOtpExpiresAt=0

        await user.save()

        return res.json({success:true,message:"Email Verified Successfully"})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }

}

export const isAuthenticated =(req,res)=>{
    try {
         return res.json({success:true,message:"Is Authenticated"})
    } catch (error) {
        return res.json({success:false,message:"Missing Details"})
    }
}

export const  sendResetOtp = async(req,res)=>{
    const {email} = req.body

    if(!email){
        return res.json({success:false,message:"Email is required"})
    }

    try {
        const user = await UserModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"Uaser not found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp
        user.resetOtpExpiresAt= Date.now() + 15*60*1000

        await user.save()

        const mailOption ={
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject:"OTP for Password Reset",
            text:`Your OTP for Reseting Password is:${otp}.Expires within 15 min`
        }

        await transporter.sendMail(mailOption)
        res.json({success:true,message:"Verification OTP sent on Email for Password Reset"})

    } catch (error) {
         return res.json({success:false,message:error.message})
    }
}

export const ResetPassword =async(req,res)=>{
    const {email,otp,newPassword} = req.body

    if(!email||!otp||!newPassword){
        return res.json({success:false,message:"Email, OTP and New Password required"})
    }
    try {
        const user = await UserModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User Not Found"})
        }

        if(!user.resetOtp || user.resetOtp !== String(otp)){
            return res.json({success:false,message:"Invalid OTP"})
        }

        if(user.resetOtpExpiresAt<Date.now()){
            return res.json({success:false,message:"OTP Expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)

        user.password = hashedPassword
        user.resetOtp=''
        user.resetOtpExpiresAt=0

        await user.save()

        return res.json({success:true,message:"Password reset Successfully"})
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}