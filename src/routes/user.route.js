const express = require('express')
const {
  signup,
  login,
  logout,
  feed,
  user,
  userDelete,
  userUpdate,
} = require('../controllers/user.controller')
const router = express.Router()

// fetch data
router.get('/users', user)
router.get('/feeds', feed)

// authorized data
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)

// update user
router.patch('/update/:id', userUpdate)

// delete user
router.delete('/delete/:id', userDelete)

module.exports = router
