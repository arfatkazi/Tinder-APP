const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
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
      min: [18, 'Age must be at least 18 years'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others'],
        message: '{VALUE} is incorrect data type',
      },
      required: [true, 'Gender is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      minlength: [10, 'Contact number must be at least 10 digits'],
      validate: {
        validator: (v) =>
          validator.isMobilePhone(v, 'any', { strictMode: false }),
        message: (props) => `${props.value} is not a valid contact number!`,
      },
    },
    height: {
      type: Number,
      required: [true, 'Height is required'],
      min: [50, 'Height must be at least 50 cm'],
    },
    profilePicture: {
      type: String,
      default: 'default.jpg',
      validate: {
        validator: function (v) {
          return v === 'default.jpg' || validator.isURL(v)
        },
        message: (props) =>
          `${props.value} is not a valid URL or is not the default picture!`,
      },
    },

    bio: {
      type: String,
      maxlength: [200, 'Bio cannot be longer than 200 characters'],
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => v.length <= 50,
        message: 'Interest cannot be longer than 50 interest fields',
      },
    },
  },
  { timestamps: true }
)

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

userSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    next()
  } catch (err) {
    return next(err)
  }
})

userSchema.index({ email: 1 })
const User = mongoose.model('User', userSchema)

module.exports = User
