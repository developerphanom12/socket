const db = require('../models/db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

function loginUser(username, password, callback) {

  const query = 'SELECT * FROM user01 WHERE username = ?';

  db.query(query, [username], async (err, results) => {
    if (err) {
      return callback(err, null);   
    }

    if (results.length === 0) {
      return callback(null, { error: 'User not found' });
    }

    const user = results[0];

    if (user.is_deleted === 1) {
      return callback(null, { error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return callback(null, { error: 'Invalid password' });
    }

    const secretKey = 'secretkey';
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, secretKey);

    return callback(null, {
      data: {
        user: {
          id: user.id,
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          token: token,
        }
      }
    });
  });
}

const getUserById = async (userId) => {
  return new Promise((resolve, reject) => {

  const query  = ` SELECT * FROM user01 WHERE id = ?`
  db.query(query, [userId], (error, results) => {
    if (error) {
      reject(error);
    } else { 
      resolve(results.map(message => ({
        username: message.username
      })));
    }
  });
  })
};

const getUserByUsername = async (username) => {
  const [results] = await db.execute('SELECT * FROM user01 WHERE username = ?', [username]);
  return results.length > 0 ? results[0] : null;
};

module.exports = { loginUser, getUserById, getUserByUsername };
