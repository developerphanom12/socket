const express = require('express');
const authMiddleware = require('../middleware/authmiddleware');
const { getUserById } = require('../models/user');

const router = express.Router();

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);
 
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
