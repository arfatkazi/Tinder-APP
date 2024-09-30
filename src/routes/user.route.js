const express = require('express')
const {
  signup,
  login,
  logout,
  feed,
  user,
} = require('../controllers/user.controller')
const router = express.Router()

// fetch data
router.get('/users', user)
router.get('/feeds', feed)

// authorized data
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

module.exports = router
