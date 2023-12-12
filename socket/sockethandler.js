const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/user');
const { getMessages, saveMessageToDatabaseasync } = require('../models/message');
const authenticateToken = require('../middleware/authmiddleware');

const socketHandler = async (io, socket) => {
  console.log(`User connected with ID: ${socket.id}`);

  const { token } = socket.handshake.query;

  try {
    if (!token) {  
      throw new Error('Authentication failed. Token not provided.');
    }

    const decoded = jwt.verify(token, 'secretkey');
    const userId = decoded.id;
    console.log("Decoded Token:", decoded);

    const user = await getUserById(userId);

    if (!user) {
      throw new Error('Authentication failed. User not found.');
    }

    socket.request.user = user;
            
    io.emit('userJoined', user);

    const messages = await getMessages(userId);
    console.log("Initial Messages:", messages);
  } catch (error) {
    console.error(error.message);
    socket.emit('authenticationError', { message: error.message });
    socket.disconnect(true); 
    return;
  }

  socket.on('sendMessage', async (data) => {  
    try {
      const { receiverId, body } = data;
      const receiverSocket = io.sockets.connected[receiverId];

      if (receiverSocket) {
        receiverSocket.emit('newMessage', { sender: socket.request.user });
      } else {
        console.log('Receiver socket not found. Saving message to database...');
        await saveMessageToDatabaseasync(socket.request.user.id, receiverId, body);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('getInitialMessages', async () => {
    try {
      if (!socket.request) {
        console.error('User information not found. Unable to fetch initial messages.');
        return;
      }
  
      const decoded = jwt.verify(token, 'secretkey');
      const userId = decoded.id;
      console.log(`Fetching initial messages for user ${userId}`);
  
      const messages = await getMessages(userId);
  
      socket.emit('initialMessages', { messages });
    } catch (error) {
      console.error('Error fetching initial messages:', error);
  
      // Emit an error event to the client
      socket.emit('initialMessagesError', { error: 'JWT Malformation Error' });
    }
  });
  
  
 
  socket.on('disconnect', () => {
    console.log(`User disconnected with ID: ${socket.id}`);
    io.emit('userDisconnected', socket.request.user);
  });
};

module.exports = socketHandler;








