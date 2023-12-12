const express = require('express');
const jwt = require('jsonwebtoken');
const { loginUser } = require('../models/user');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    loginUser(username, password, (err, result) => {
      if (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'An internal server error occurred' });
      }

      if (result.error) {
        return res.status(401).json({ error: result.error });
      }


      res.status(200).json({
        message: 'that',
        data: result.data,
        token: result.token,
      });

    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'An internal server error occurred' });
  }
});


module.exports = router;
