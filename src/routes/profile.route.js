const express = require('express')
const { Profileview } = require('../controllers/user.controller')
const UserAuth = require('../middlewares/auth')
const router = express.Router()

router.get('/view', UserAuth, Profileview)
router.patch('/edit')
router.patch('/password')

module.exports = router

// const UserAuth = require('../middlewares/auth')
// update user
// router.patch('/update/:id', UserAuth, userUpdate)

// delete user
// router.delete('/delete/:id', UserAuth, userDelete)

// fetch data
// router.get('/users', UserAuth, user)
