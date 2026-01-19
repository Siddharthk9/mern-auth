import mongoose from "mongoose";
import { type } from "os";

const Schema = new mongoose.Schema({
    "name":{type:"String",required:true},
    "email":{type:"String",required:true,unique:true},
    "password":{type:"String",required:true},
    "verifyOtp":{type:"Number",default:''},
    "verifyOtpExpiresAt":{type:"Number",default:0},
    "isAccountVerified":{ type:"Boolean",default:false},
    "resetOtp":{type:"String",default:''},
    "resetOtpExpiresAt":{type:Number,default:0}
})

const UserModel = mongoose.model.user || mongoose.model('user',Schema)

export default UserModel