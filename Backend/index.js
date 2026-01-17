import express from "express"
import http from "http"
import cors from "cors"
import "dotenv/config"
import connectDb from "./config/mongodb.js"
import authRouter from "./routes/AuthRoutes.js"
import userRouter from "./routes/userRoutes.js"
import postRouter from "./routes/postRoutes.js"
import connectCloudinary from "./config/cloudinary.js"
import chatRouter from "./routes/chatRoutes.js"
import { Server } from "socket.io";
import notificationRouter from "./routes/notificationRoutes.js"
import storyRouter from "./routes/storyRoutes.js"



const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000

// Initialize socket.io server
export const io = new Server(server, {
  cors: {origin: "*"}
})

// Store Online users
export const userSocketMap = {}; // {userId: socketId}

// Socket.io connection handler
io.on("connection", (socket)=>{
  
  const userId = socket.handshake.query.userId;

  if(userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connection
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", ()=>{
    console.log("User Disconnected", userId);
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDb()
connectCloudinary()

//middlewares
app.use(cors())
app.use(express.json())

// api endpoints

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/post", postRouter)
app.use("/api/messages", chatRouter)
app.use("/api/notification", notificationRouter)
app.use("/api/story",storyRouter)



server.listen(4000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:4000");
});

