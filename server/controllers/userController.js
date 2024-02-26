const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const asynchandler = require('express-async-handler')
const validator = require("validator");

module.exports.login = asynchandler (async (req, res, next) => {
  let {userName, password } = req.body;
  if (!userName || !password) {   
    let error = new Error("Username and password are required");
    error.status = 400;
    throw error;
  }
  userName = userName.trim();
  password = password.trim();

  const user = await User.findOne({ userName: userName });
  if (!user) {
    const error = new Error("Username is not correct");
    throw error;
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    let error = new Error("Password is not correct");
    throw error;
  }
  res.status(200).json({
    status:true,
    user: user
  });
});

module.exports.register = asynchandler ( async (req, res, next) => {
  let { userName, email, password, confirmPassword } = req.body;
  userName = userName.trim();
  email = email.trim();
  password = password.trim();
  confirmPassword = confirmPassword.trim();

  const name = await User.findOne({ userName: userName });

  if (name) {
    const error = new Error("Username already exists");
    throw error;
  }
  if (!validator.isEmail(email)) {
    const error = Error("Email is not correct");
    throw error;
  }
  const mail = await User.findOne({ email: email });
  if (mail) {
    const error = Error("Email already exists");
    throw error;
  }

  if (password != confirmPassword) {
    const error = new Error("Passwords do NOT match");
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedConfPassword = await bcrypt.hash(confirmPassword, 10);
 
  const newUser = new User ({
    userName,
    email,
    password:hashedPassword,
    confirmPassword:hashedConfPassword
  });
   
   newUser.save();
  return res.json({
    status: true,
    user: newUser
  });
});

module.exports.getAllUsers = asynchandler ( async (req, res, next) => {
  const  id = req.params.id;
  const users = await User.find({ _id: { $ne: id } }).select(["userName, email, avatarImage, _id"]);
  res.json({
    users,
    status: true
  });
});

module.exports.setAvatar = asynchandler(async (req, res, next) => {
  console.log("here")
  const id = req.params.id;
  const avatarImage = req.body.image;
  const data = await User.findOneAndUpdate(
    {_id: new mongoose.Types.ObjectId(id)},
    {
      $set: {
        avatarImage: avatarImage,
        isAvatarImageSet: true
      }
    },
    {
      new: true
    }
  )
  res.json({
      isSet: data.isAvatarImageSet,
      image: data.avatarImage,
  })

});

module.exports.logOut = (req, res, next) => {

};