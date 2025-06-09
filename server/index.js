const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const Message = require("./models/messageModel")
const jwt = require("jsonwebtoken")
const cookie = require('cookie')
require('dotenv').config()
const app = express()

const userRoute = require("./routes/userRoute")
const messageRoute = require("./routes/messageRoute")

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
)
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Database connection error:', err))

const server = app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});

const io = require('socket.io')(server, {
    cors: {
        origin: true,  
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true,
    }
});


app.use("/user", userRoute)
app.use("/chat", messageRoute)

io.on('connection', (socket) => {

     socket.on('chatMessage', async (data) => {

         const cookies = socket.handshake.headers.cookie
        
        if (cookies) {
            const parsedCookies = cookie.parse(cookies)
            const token = parsedCookies['token']
            try{
                const verified = jwt.verify(token, process.env.JWT_SECRET)
                if(verified.email === data.email)
                {
                    const newMessage = new Message({
                        message: data.message,
                        username: verified.username,
                        admin: verified.admin,
                        email: verified.email,
                        sentAt: new Date()
                    })
                    await newMessage.save()
                    io.emit('message', data);
                }
            } catch(error) {
                console.log(error)
            }
            
        }
    })

});