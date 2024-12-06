const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//require('dotenv').config();

const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  loginHistory: [{ dateTime: { type: Date, default: Date.now }, userAgent: String }],
});

const User = mongoose.model('User', userSchema);

// Initialize MongoDB Connection
async function initialize() {
  try {
    await mongoose.connect('mongodb+srv://makhan118:O5qIU4vmt54J9qMx@cluster0.k6hsk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

    console.log('MongoDB connection successful');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
}

// Register User
async function registerUser(userData) {
  if (userData.password !== userData.password2) {
    throw new Error('Passwords do not match');
  }

  try {
    // Hash the password
    const hash = await bcrypt.hash(userData.password, 10);
    userData.password = hash;

    // Save the user
    const newUser = new User(userData);
    await newUser.save();
  } catch (err) {
    if (err.code === 11000) {
      throw new Error('User Name already taken');
    }
    throw new Error(`There was an error creating the user: ${err.message}`);
  }
}

// Check User
async function checkUser(userData) {
  try {
    const user = await User.findOne({ userName: userData.userName });
    if (!user) {
      throw new Error(`Unable to find user: ${userData.userName}`);
    }

    const passwordMatch = await bcrypt.compare(userData.password, user.password);
    if (!passwordMatch) {
      throw new Error(`Incorrect Password for user: ${userData.userName}`);
    }

    // Update login history (keep the last 8 entries)
    user.loginHistory.unshift({ dateTime: new Date(), userAgent: userData.userAgent });
    if (user.loginHistory.length > 8) {
      user.loginHistory.pop();
    }

    await user.save();
    return user;
  } catch (err) {
    throw new Error(`Authentication failed: ${err.message}`);
  }
}

module.exports = { initialize, registerUser, checkUser };
