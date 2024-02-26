const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const asynchandler = require('express-async-handler')
const validator = require("validator");

module.exports.login = asynchandler (async (req, res, next) => {
  let { username, password } = req.body;
  if (!username || !password) {   
    let error = new Error("Username and password are required");
    error.status = 400;
    throw error;
  }
  username = username.trim();
  password = password.trim();

  const user = await User.findOne({ username: username });
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
     user
  });
});

module.exports.register = asynchandler ( async (req, res, next) => {
  let { username, email, password } = req.body;
  const name = await User.findOne({ username: username });
  if (name) {
    const error = new Error("Username already exists");
    throw error;
  }
  username = username.trim();
  if (!validator.isEmail(email)) {
    const error = Error("Email is not correct");
    throw error;
  }
   email = email.trim();

  const mail = await User.findOne({ email: email });
  if (mail) {
    const error = Error("Email already exists");
    throw error;
  }
    password = password.trim();


  const hashedPassword = await bcrypt.hash(password, 10);
 
  const user = new User ({
    username: username,
    email,
    password:hashedPassword,
  });
   
   newUser.save();
  return res.json({
    status: true,
    user
  });
});

module.exports.getAllUsers = asynchandler(async (req, res, next) => {
  const  id = req.params.id;
  const users = await User.find({ _id: { $ne: id } }).select(["username", "email", "avatarImage", "_id"]);
  res.json(users);
});





module.exports.setAvatar = asynchandler(async (req, res, next) => {

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
  if (req.params.id) {
    res.status(200).send();
  }
  else {
    res.status(404).send("id is required")
  }
};