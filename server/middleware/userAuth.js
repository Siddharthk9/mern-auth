import jwt from "jsonwebtoken"

const userAuth = async(req,res,next)=>{

    const {token} = req.cookies

    if(!token){
        return res.json({success:false,message:"Not Authorized. Login Again"})
    }

    try {

    const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
     console.log("hello")

    if(tokenDecode){
        // req.body.userID=tokenDecode.id
        console.log("The body is "+req.body)

    //      req.body= { 
    //   userID: tokenDecode.id
    // }

         if(req.body==undefined){
            req.body= { 
      userID: tokenDecode.id
    }
         }
         else{
             req.body.userID=tokenDecode.id
}


    }
    else{
        return res.json({success:false,message:"Not Authorized. Login Again"})
    }
    next()
        
    } catch (error) {
        return res.json({success:false,message:error.message})
    }

}

export default userAuth