const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
)

// userSchema.pre('save', async (next) => {
//   const user = this

//   if (!user.isModified('password')) return next()

//   try {
//     const salt = await bcrypt.genSalt(10)
//     user.password = await bcrypt.hash(user.password, salt)
//     next()
//   } catch (err) {
//     return next(err)
//   }
// })

const User = mongoose.model('User', userSchema)

module.exports = User
