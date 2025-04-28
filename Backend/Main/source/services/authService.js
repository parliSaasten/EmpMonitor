const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const key = crypto.createHash('sha256').update(process.env.JWT_SECRET).digest('base64').substr(0, 32);

function encryptPassword(password) {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    console.error('Error in encryptPassword: ', error);
    throw error;
  }
}

function decryptPassword(userPassword, encryptedPassword) {
  try {
    const [ivHex, encrypted] = encryptedPassword.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    if (userPassword) return userPassword === decrypted;
    return decrypted;
  } catch (error) {
    console.error('Error in decryptPassword: ', error);
    throw error;
  }
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
}

async function getLoginUserData(req) {
  try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) {
        console.error('Token not provided: ', error);
        throw error;
      }

      const user = jwt.verify(token, process.env.JWT_SECRET);

      return user;
  } catch (error) {
    console.error('Error in decryptPassword: ', error);
    throw error;
  }
  
}

module.exports = {
  encryptPassword,
  decryptPassword,
  generateToken,
  getLoginUserData
};
