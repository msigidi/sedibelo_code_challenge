const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

// Database setup
const db = new sqlite3.Database('./encryptedData.db');

// Encryption key (in production, store this securely)
const ENCRYPTION_KEY = crypto.randomBytes(32); // 256-bit key
const IV_LENGTH = 16; // AES block size

// Encrypt function
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt function
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Initialize the database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )`);
});

// Add encrypted user
function addUser(id, name, email) {
    const encryptedName = encrypt(name);
    const encryptedEmail = encrypt(email);
    db.run(`INSERT INTO users (id, name, email) VALUES (?, ?, ?)`, [id, encryptedName, encryptedEmail], function (err) {
        if (err) {
        return console.error(err.message);
        }
        console.log(`A new user has been added with id: ${id}`);
    });
}

// Get and decrypt user by ID
function getUser(id) {
  db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      console.log('User:', {
        id: row.id,
        name: decrypt(row.name),
        email: decrypt(row.email),
      });
    } else {
      console.log(`User with id ${id} not found`);
    }
  });
}

// Update encrypted user
function updateUser(id, name, email) {
  const encryptedName = encrypt(name);
  const encryptedEmail = encrypt(email);
  db.run(`UPDATE users SET name = ?, email = ? WHERE id = ?`, [encryptedName, encryptedEmail, id], function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User with id ${id} has been updated`);
  });
}

// Delete user
function deleteUser(id) {
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) {
      return console.error(err.message);
    }
    console.log(`User with id ${id} has been deleted`);
  });
}

module.exports = {
  addUser,
  getUser,
  updateUser,
  deleteUser,
};
