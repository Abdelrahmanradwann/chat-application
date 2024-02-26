const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  message: {
    text: {
      type: String,
      required: true
    }
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  users: Array
  
},
  {
    timestamps: true  
  }
);

module.exports = mongoose.model("Messages", MessageSchema);