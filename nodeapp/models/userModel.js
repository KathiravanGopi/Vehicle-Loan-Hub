const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username already exists'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email already exists'],
    trim: true,
    lowercase: true,
    maxlength: [254, 'Email must be at most 254 characters'],
    match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Please enter a valid email address'],
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: [true, 'Mobile number already exists'],
    match: [/^\d{10}$/, 'Mobile number must be 10 digits'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: 'Role must be either Admin or User',
    },
    required: [true, 'Role is required'],
  },
});

module.exports = mongoose.model('User', UserSchema);
