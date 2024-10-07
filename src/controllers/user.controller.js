const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generateTokenAndCookie = require('../utils/generateTokenAndCookie')
const ConnectionRequest = require('../models/connectionRequest.model')

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
    res.clearCookie('token', {
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
    console.error(`Error during userdelete controller : ${err}`)
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
    console.error(`Error during  user update: ${err}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
// end of updated user

// Profileview controller
const Profileview = (req, res) => {
  try {
    const user = req.user // Use the user data from the token validated in UserAuth

    return res.status(200).json({
      message: 'Profile fetched successfully',
      profile: {
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
    console.error(`Error during profile view: ${err.message}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// end of Profileview controller

// PROFILE EDIT
const profileEdit = async (req, res) => {
  try {
    const user = req.user
    const {
      firstName,
      lastName,
      password,
      gender,
      email,
      age,
      contact,
      height,
      profilePicture,
      bio,
      interests,
    } = req.body

    if (firstName || lastName || password || gender || email) {
      return res.status(400).json({
        message:
          'You cannot change the following fields: firstName, lastName, password, gender, email',
      })
    }
    const editUser = await User.findOneAndUpdate(
      { _id: user._id },
      { age, contact, height, profilePicture, bio, interests },
      { new: true, runValidators: true }
    )

    if (!editUser) {
      return res.status(404).json({ message: 'user not found!' })
    }

    return res.status(200).json({
      message: `${user.fullName} your Profile Edited  successfully`,
      profile: {
        id: editUser._id,
        age: editUser.age,
        contact: editUser.contact,
        height: editUser.height,
        profilePicture: editUser.profilePicture,
        bio: editUser.bio,
        interests: editUser.interests,
      },
    })
  } catch (err) {
    console.error(`Error during  edit profile : ${err.message}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
//END OF  PROFILE EDIT

// forgot the password
const forgotPassword = async (req, res) => {
  try {
    const user = req.user
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ message: 'password is required!' })
    }

    user.password = password
    await user.save()

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (err) {
    console.error(`Error during forgot password controller : ${err.message}`)
    return res.status(500).json({ message: 'Inrerval server error.' })
  }
}
// end of  forgot the password

// interested/IgnoreCard card
const interestedIgnoreCard = async (req, res) => {
  try {
    const fromUserId = req.user._id // Get the sender's ID from the logged-in user
    const toUserId = req.params.toUserId //// Get the receiver's ID from the URL parameter
    const status = req.path.includes('interested') ? 'interested' : 'ignored'

    const toUserExist = await User.findById(toUserId)

    if (!toUserExist) {
      return res.status(404).json({ message: 'User not found!' })
    }
    const exisitngRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    })

    if (exisitngRequest) {
      return res.status(400).json({
        message: 'Connection request already exist between these users!',
      })
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    })

    const data = await connectionRequest.save()

    return res.status(201).json({
      message: `${req.user.firstName} is ${status} in ${toUserExist.firstName} `,
      data,
    })
  } catch (err) {
    console.error(`Error during interested/ignored card ${err.message} `)

    return res.status(500).json({ message: 'Intenral server error' })
  }
}
//end of  interested/IgnoreCard card

//Accepted Rejected card
const AcceptedRejectedCard = async (req, res) => {
  try {
    const fromUserId = req.params.fromUserId
    const toUserId = req.user._id
    const status = req.path?.includes('accepted') ? 'accepted' : 'rejected'

    const request = await ConnectionRequest.findOne({
      toUserId,
      fromUserId,
    })

    if (!request) {
      return res.status(404).json({ message: 'Connection request not found!' })
    }

    request.status = status // update the request of exisitng user

    const data = await request.save()

    return res.status(201).json({
      message: 'updated user request successfully',
      data,
    })
  } catch (err) {
    console.error(`Error during accepted/rejected controller : ${err.message}`)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
//end of Accepted Rejected card

module.exports = {
  signup,
  login,
  logout,
  feed,
  user,
  Profileview,
  userDelete,
  userUpdate,
  profileEdit,
  forgotPassword,
  interestedIgnoreCard,
  AcceptedRejectedCard,
}
