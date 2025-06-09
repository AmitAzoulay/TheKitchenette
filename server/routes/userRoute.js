const express = require("express")
const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {adminAuth,boolAdminAuth} = require("../middlewares/adminMiddlware")
const {auth,boolAuth} = require("../middlewares/authMiddleware")
const router = express.Router()

router.post("/register", async (req, res) => {
    try {
        const { email, displayName, password } = req.body
        if (!email || !displayName || !password) {
            res.status(400).send({ errorMessage: "Please enter all required fields" })
        }

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            res.status(400).send({ errorMessage: "An account with this email already exists" })
        }
        
        const newUser = new userModel({
            displayName,
            email,
            password: password,
            isAdmin: false,
        })
        await newUser.save()

        res.status(200).send()

    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).send({ errorMessage: "Please enter all required fields" })
        }

        const existingUser = await userModel.findOne({ email })
        

        if (!existingUser) {
            res.status(401).send({ errorMessage: "User does not exist" })
        }

        if (password !== existingUser.password) {
            res.status(401).send({ errorMessage: "Wrong email or password" })
        }

        const token = jwt.sign({
            user: existingUser._id,
            email: email,
            username: existingUser.displayName,
            isAdmin : existingUser.isAdmin,
        }, process.env.JWT_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
        }).send()

    } catch (error) {
        res.status(500).send()
    }
})


router.get("/logout", async (req, res) => {
    res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    path: "/", 
    }).send()
})

router.get("/loggedIn",boolAuth, async (req, res) => {
    res.json(true)
})

router.get("/current", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ errorMessage: "Unauthorized" })

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(verified.user).select("-password").select("-_id")

        res.json(user)
    } catch (err) {
        console.error(err);
        res.status(401).json({ errorMessage: "Unauthorized" })
    }
})
router.get("/", async (req, res) => {
    res.status(200).send()
})
router.get("/isAdmin",boolAdminAuth,async (req, res) => {
 
    
})

router.get("/getUsers" , adminAuth ,async (req, res) => {
    try {
        const users = await userModel.find().select("-password").select("-_id")
        res.json(users)
    } catch(error) {
        res.status(500).send() 
    }
})

router.delete("/delete/:email", adminAuth, async (req, res) => {
    try {
        const deletedUser = await userModel.findOneAndDelete({email: req.params.email})
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' })
        } 
        res.json(deletedUser)
    } catch(error) {
        res.status(500).send() 
    }
})

module.exports = router