import UserModel from "../models/userModel.js"

export const userData = async(req,res)=>{
    try {
        const userID = req.body.userID
        const user = await UserModel.findById(userID)

        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}