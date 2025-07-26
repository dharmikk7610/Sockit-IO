import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const userSchema = new  mongoose.Schema({
    username :{
        type:String ,
        require :true 
        
    },
    password :{
        type:String
    },
    isonline:
    {
        type:Boolean
    },
    lastseen:{
        type :Date
    }
})
userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.ispasswordcorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
const User = mongoose.model("User",userSchema);
export default User ;