const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const authMiddleware = require('./middleware/authmiddleware'); // Adjust the path
const messagingRouter = require('./api/messaging');
const userRouter = require('./api/user');
const auhtrouter =  require('./api/auth')
const socketHandler = require('./socket/sockethandler');
const dotenv = require('dotenv');
const cors = require('cors')
const app = express();
const httpServer = require('http').createServer(app);



const io = require('socket.io')(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Add your frontend origin here
    methods: ["GET", "POST"]
  }
});

dotenv.config();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.io = io;
  next();
}); 

app.use(cors({
  origin: ['http://localhost:3000'], 
}));


// API routes
app.use('/api/messaging', messagingRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', auhtrouter);
app.use(express.static('public')); 

// WebSocket setup
io.on('connection', (socket) => {
  socketHandler(io, socket);
});

// Start the server
const PORT = process.env.PORT || 3900;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
