const express = require('express')
const router = express.Router()
const { signup, login, logout } = require('../controllers/user.controller')

const UserAuth = require('../middlewares/auth')

// authorized data
router.post('/signup', signup)
router.post('/login', UserAuth, login)
router.post('/logout', UserAuth, logout)

module.exports = router
