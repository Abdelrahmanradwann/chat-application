const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 20
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  confirmPassword: {
    type: String,
    required: true
  },
  avatarImage: {
    type: String,
    default: "",
  },
   isAvatarImageSet: {
    type: Boolean,
    default: false,
  },

});

module.exports = mongoose.model("Users", userSchema);