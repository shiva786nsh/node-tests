const express = require('express');
const routers = express.Router();
const User = require('../controllers/userControllers');



routers.post('/signup',User.registerUser);
routers.post('/login',User.loginUser);
routers.post("/user",User.getUserDetails)
routers.post('/forgotPassword',User.sendmail)
routers.patch('/resetPassword',User.resetPassword)

module.exports = routers;       