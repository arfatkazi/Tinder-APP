const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generateTokenAndCookie = require('../utils/generateTokenAndCookie')
//signup controller

const signup = async (req, res) => {
  try {
    let { firstName, lastName, password, contact, email, gender, age, height } =
      req.body

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json(`firstName, lastName, email, password are required!`)
    }
    const findUser = await User.findOne({ email })
    if (findUser) {
      return res
        .status(409)
        .json({ message: 'User with this email  already exist' })
    }

    // //hashing the password
    // const genSalt = await bcrypt.genSalt(10)
    // const hashPassword = await bcrypt.hash(password, genSalt)

    const newUser = new User({
      firstName,
      lastName,
      password,
      contact,
      email,
      gender,
      age,
      height,
    })

    await newUser.save()

    const token = await generateTokenAndCookie(res, newUser)
    return res.status(201).json({
      message: 'New user created successfully!',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        contact: newUser.contact,
        gender: newUser.gender,
        age: newUser.age,
        height: newUser.height,
      },
    })
  } catch (err) {
    console.error(`Error during signup: ${err}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//end of signup controller

// login controller

const login = async (req, res) => {
  try {
    let { email, password } = req.body

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required!' })
    }
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      })
    }

    const token = req.cookies.token
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded.id === user._id.toString()) {
          return res.status(200).json({
            message: 'Login successful, using existing token',
            token,
            user: {
              id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              contact: user.contact,
              gender: user.gender,
              age: user.age,
              height: user.height,
            },
          })
        }
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('Token expired, generating a new token.')
        } else {
          console.log(`Error checking existing cookie: ${err}`)
        }
      }
    }

    const newToken = await generateTokenAndCookie(res, user)

    return res.status(200).json({
      message: 'Login successful',
      token: newToken,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contact: user.contact,
        gender: user.gender,
        age: user.age,
        height: user.height,
      },
    })
  } catch (err) {
    console.error(`Error during login: ${err}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//end of login controller

// logout controller

const logout = async (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    return res.status(200).json({ message: 'Logged out successfully!' })
  } catch (err) {
    console.error(`Error during logout: ${err}`)
    next(err) // pass error to error-handling middleware
  }
}

//end of  logout controller

// feed controller
const feed = async (req, res) => {
  try {
    let { email, password } = req.body
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: 'email and password are required!' })
    }

    const users = await User.find({ email: { $ne: email } })

    if (users.length === 0) {
      return res.status(404).json('No users found')
    }

    return res.status(200).json({ message: 'user found', users: users })
  } catch (err) {
    console.log(`Error during feed: ${err}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// end of feed controller

// get all user controller
const user = async (req, res) => {
  try {
    const user = await User.find({})
    if (user.length === 0) {
      return res.status(404).json({ message: 'user not found' })
    }
    return res.status(200).json({ message: 'user found', user: user })
  } catch (err) {
    console.log(`Error during user controller : ${err}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//end of  get all user controller

// delete user

const userDelete = async (req, res) => {
  try {
    const { id } = req.params
    console.log(id)
    const deleteUser = await User.findByIdAndDelete(id)

    if (!deleteUser) {
      return res.status(404).json({ message: 'user not found' })
    }

    return res.status(201).json({ message: 'user deleted successfully' })
  } catch (err) {
    console.log(`Error during userdelete controller : ${err}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// end of delete user

// updated user

const userUpdate = async (req, res) => {
  try {
    const { id } = req?.params
    const updatedData = req?.body

    if (
      updatedData?.email &&
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updatedData?.email)
    ) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    delete updatedData.email

    const updateUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    })
    if (!updateUser) {
      return res.status(404).json({ message: 'user not found' })
    }

    return res
      .status(200)
      .json({ message: 'user updated sucessfully', user: updateUser })
  } catch (err) {
    console.log(`Error during  user update: ${err}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
// end of updated user

module.exports = { signup, login, logout, feed, user, userDelete, userUpdate }
