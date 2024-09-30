const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'others'],
    required: [true, 'Gender is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    minlength: [10, 'Contact number must be at least 10 digits'],
  },

  height: {
    type: Number,
    required: [true, 'Height is required'], // Height is now required
    min: [50, 'Height must be at least 50 cm'],
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
