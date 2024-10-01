const jwt = require('jsonwebtoken')

const generateTokenAndCookie = async (res, user) => {
  const payload = {
    id: user._id,
    email: user.email,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000,
  })

  return token
}

module.exports = generateTokenAndCookie
