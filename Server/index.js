import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import cors from 'cors';
import userroute from './src/Routes/userRoute.js';
import User from './src/Model/userModel.js'

const app = express();
const port = 5000;
const server = http.createServer(app);
const onlineUsers = {};

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true,
}));
app.use(express.json()); //  Parse incoming JSON

// Routes
app.use('/user', userroute);

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/myChat')
  .then(() => {
    console.log(' DB connection successful');
  })
  .catch((err) => {
    console.error(' DB connection failed:', err);
  });

// Socket.IO Events
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.emit("welcome","welcome coding carrier");


 // Join event from frontend to register user
  socket.on('join', async(username) => {
    socket.username = username;
    onlineUsers[username] = socket.id;
      await User.findOneAndUpdate(
    { username },
    { isonline: true },
    { new: true }
  );
  });

   socket.on('message', ({ to, text }) => {
    const toSocketId = onlineUsers[to];
    if (toSocketId) {
      io.to(toSocketId).emit('receive-message', {
        from: socket.username,
        text ,
      });
    }
  });

  socket.on("disconnect", async () => {
  const username = Object.entries(onlineUsers).find(([_, id]) => id === socket.id)?.[0];
  
  if (username) {
    delete onlineUsers[username];

    await User.findOneAndUpdate(
      { username },
      { isonline: false, lastseen: new Date() }
    );

    io.emit("online-users", Object.keys(onlineUsers));
  }

  console.log("User disconnected", socket.id);
});


  // socket.on('disconnect', () => {
  //   console.log('❌ User disconnected:', socket.id);
  // });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server started on http://localhost:${port}`);
});
