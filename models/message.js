const db = require('./db');

async function saveMessageToDatabaseasync (senderId, receiverId, content) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO messages (sender_id, receiver_id, body) VALUES (?, ?, ?)';
  
      db.query(query, [senderId, receiverId, content], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.length > 0);
        }
      });
    });
  }

  const getMessages = async (userId) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT sender_id, receiver_id, body FROM messages WHERE receiver_id = ?';
  
      db.query(query, [userId], (error, results) => {
        if (error) {
          reject(error);
        } else { 
          resolve(results.map(message => ({
            sender_id: message.sender_id,
            receiver_id: message.receiver_id,
            body: message.body 
          })));
        }
      });
    });
  };
  
module.exports = { saveMessageToDatabaseasync, getMessages };


