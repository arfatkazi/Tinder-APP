const express = require('express')
const router = express.Router()
const { Profileview, profileEdit } = require('../controllers/user.controller')
const UserAuth = require('../middlewares/auth')

// const UserAuth = require('../middlewares/auth')
// update user
// router.patch('/update/:id', UserAuth, userUpdate)

// delete user
// router.delete('/delete/:id', UserAuth, userDelete)

// fetch data
// router.get('/users', UserAuth, user)

router.get('/profile/view', UserAuth, Profileview)
router.patch('/profile/edit', UserAuth, profileEdit)
router.patch('/password')

module.exports = router
