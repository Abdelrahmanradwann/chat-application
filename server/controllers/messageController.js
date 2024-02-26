const Messages = require("../models/messageModel");
const asynchandler = require("express-async-handler")


module.exports.getMessages = asynchandler(async (req, res, next) => {
  const { from, to } = req.body;
  // get all messages between sender and reciever
  const messages = await Messages.find({
    users: {
      $all: [from, to]
    }
  }).sort({updatedAt: 1})
  // want to differentiate between who send what message to the frontend
  const returnedMessages = messages.map(msg => {
    return {
      fromSelf : msg.sender.toString() === from,
      message: msg.message.text,   
    }
  })

  res.json(returnedMessages)

});

module.exports.addMessage = asynchandler(async (req, res, next) => {
  const { from, to, message } = req.body;
  const approvedMessage = await Messages.create({
    message: { text: message },
    users: [from, to],
    sender: from
  })

  if (approvedMessage) {
    res.json({ msg: "Message added successfully." });
  }
  else {
    res.json({ msg: "Failed to add message to the database" })
  }
});