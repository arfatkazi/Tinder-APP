const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const UserAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({ message: 'token does not exist!' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized, invalid token!' })
    }

    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res
        .status(401)
        .json({ message: "We can't find a user with this token." })
    }

    req.user = user
    next()
  } catch (err) {
    console.log(`Error during protect route: ${err.message}`)

    return res.status(500).json({ message: 'Internal server error' })
  }
}

module.exports = UserAuth
