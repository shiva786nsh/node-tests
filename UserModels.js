const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({

    firstName:String,
    lastName:String,
    email:{type:String,unique:true},
    password:String      
});



userSchema.methods.isPasswordCorrect = async function (password){
    console.log(this.password,password);
    
  return await bcrypt.compare(password,this.password);
};

userSchema.methods.jwttoken = async function(){
    const token = jwt.sign({
        _id : this.id,
        email : this.email,
    },"sjflsdjfosldjflksj$%#$1213$%#$gdf212gd",{
        expiresIn:"5m"
    })
    return token;
}

const User = mongoose.model("user",userSchema);

module.exports = User;
 