const express = require('express')
const router = express.Router()
// const UserAuth = require('../middlewares/auth')
// update user
// router.patch('/update/:id', UserAuth, userUpdate)

// delete user
// router.delete('/delete/:id', UserAuth, userDelete)

// fetch data
// router.get('/users', UserAuth, user)

router.get('/view')
router.patch('/edit')
router.patch('/password')

module.exports = router
