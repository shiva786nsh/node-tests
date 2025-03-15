const User = require("../models/UserModels");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.status(400).json({ message: "User is already exist" });
    } else {
        const hashedPassword = await bcrypt.hash(password,10)
      const user = await new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      });
      user.save();
      return res.status(201).json({ message: "user created successfully" });
    }
  } catch (error) {
    console.log(`error when register user ${error}`);

    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const passwordMatch = await user.isPasswordCorrect(password);


    if (!passwordMatch) {
      return res.status(400).json({ message: "password is incorect" });
    }
    const token = await user.jwttoken();
    // res.cookie("authToken", token,);
    return res
      .status(200)
      .json({ message: "login Successfully", token: token });
  } catch (error) {
    console.log(`login error ${error}`);
  }
};     

const getUserDetails = async (req, res) => {
  let token = req.body.token
   console.log(token);   
   if(token){
    const decoded = jwt.verify(token, "sjflsdjfosldjflksj$%#$1213$%#$gdf212gd");

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(400).json({ message: "user not found" });  
    } else {
      return res.status(200).json({ user: user });   
    }    
   }
  
};

const sendmail = async (req, res) => {   
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    pool: true,
    auth: {
      user: "example@gmail.com",
      pass: "examplePassword",  
    },
  });
  const { email } = req.body;
  if(!email){
      return res.status(400).json({message:"email is required"});
  }
 const token = jwt.sign({
        email
    },"sjflsdjfosldjflksj$%#$1213$%#$gdf212gd",{
        expiresIn:"5m"
    })
   
  const resetLink = `http://localhost:5173/resetPaasword?token=${encodeURIComponent(
    token
  )}`;
  const mailOption = {
    from: "example@gmail.com",
    to: email,
    subject: "reset password",
    html: `<p>Click the link to reset password :</p> <a href="${resetLink}">reset Password</a>`,
  };

  try {
    await transporter.sendMail(mailOption);
  
    
    return res.status(200).json({ message: "email sent successfully" });
  } catch (error) {
    console.log(error);
    
    res
      .status(500)
      .json({ message: "Error sending email .please try again later" });
  }
};

const resetPassword = async (req,res)=>{
    const Token = req.body.urlToken;
   console.log(req.body.urlToken);
   
    let newtoken = Token.replace(/token=/,'')
    newtoken= newtoken.replace(/=+$/,'')
    
    
    const {password,confirmPassword} = req.body;
    const decoded = jwt.verify(newtoken, "sjflsdjfosldjflksj$%#$1213$%#$gdf212gd");
    console.log(decoded.email);
    const email = decoded.email
    
    const user = await User.findOne({email:email});
    console.log(user);
    
    if (!user) {
        return res.status(400).json({ message: "user not found" });
      }
      const passwordMatch = password === confirmPassword;   
      if(!passwordMatch){  
        return res.status(400).json({message:"password do not match"})
      }
      try {   
        const hashedPassword = await bcrypt.hash(password,10)
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({message:"password reset successfully"})     
      } catch (error) {   
        res.status(500).json({message:"error resetting password"});    
      }   
   

}

module.exports = { registerUser, loginUser, getUserDetails,sendmail,resetPassword };
