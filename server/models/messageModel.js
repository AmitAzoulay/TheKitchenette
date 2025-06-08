const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message: String,
    username: String,
    admin: Boolean,
    email: String,
    sentAt: Date,
})

module.exports = mongoose.model("Message", messageSchema)