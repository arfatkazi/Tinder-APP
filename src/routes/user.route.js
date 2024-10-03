const express = require('express')
const router = express.Router()
const {
  signup,
  login,
  logout,
  feed,
  user,
  userDelete,
  userUpdate,
} = require('../controllers/user.controller')

const UserAuth = require('../middlewares/auth')

// fetch data
router.get('/users', UserAuth, user)
router.get('/feeds', UserAuth, feed)

// authorized data
router.post('/signup', signup)
router.post('/login', UserAuth, login)
router.post('/logout', UserAuth, logout)

// update user
router.patch('/update/:id', UserAuth, userUpdate)

// delete user
router.delete('/delete/:id', UserAuth, userDelete)

module.exports = router
