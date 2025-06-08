const express = require("express")
const Message = require("../models/messageModel")
const {auth,boolAuth} = require("../middlewares/authMiddleware")

const router = express.Router()



router.get("/getMessages",auth ,async (req,res) => {
    try {
       const messages = await Message.find().select("-_id")
       res.json(messages)
    } catch(error) {
        res.status(500).send() 
    }
})

module.exports = router