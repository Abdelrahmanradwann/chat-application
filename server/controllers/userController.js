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
    const error = new Error("hehe");
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

module.exports.getAllUsers = async (req, res, next) => {

};

module.exports.setAvatar = async (req, res, next) => {

};

module.exports.logOut = (req, res, next) => {

};