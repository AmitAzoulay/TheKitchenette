const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    displayName: String,
    password: String,
    isAdmin: { type: Boolean, default: false }
})

module.exports = mongoose.model("User", userSchema)