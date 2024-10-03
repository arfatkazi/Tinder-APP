const express = require('express')
const router = express.Router()
const { feed } = require('../controllers/user.controller')
const UserAuth = require('../middlewares/auth')

router.get('/requests')
router.get('/connections')
router.get('/feed', UserAuth, feed)

module.exports = router
