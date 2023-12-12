const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const { saveMessageToDatabaseasync ,getMessages} = require('../models/message');

const router = express.Router();

router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { receiverId, body } = req.body;
    const senderId = req.user.id;

    console.log(`Message sent from ${senderId} to ${receiverId}: ${body}`);

    req.io.emit('sendMessage', {
      senderId,
      receiverId,
      body,
    });
    await saveMessageToDatabaseasync(senderId, receiverId, body);

    res.json({ success: true, message: 'Message sent successfully' }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("dsfhbshdbhsdf", userId);
    const messages = await getMessages(userId);

  //   // Emit socket event with the retrieved messages
  //  console.log( req.io.emit('initialMessages', messages) );

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
module.exports = router;


