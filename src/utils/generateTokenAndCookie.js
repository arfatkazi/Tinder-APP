const jwt = require('jsonwebtoken')

const generateTokenAndCookie = async (res, user) => {
  const payload = {
    id: user._id,
    email: user.email,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000,
  })

  return token
}

module.exports = generateTokenAndCookie
