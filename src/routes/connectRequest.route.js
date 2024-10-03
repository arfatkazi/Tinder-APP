const express = require('express')
const router = express.Router()

router.post('/send/interested/:userId')
router.post('/send/ignored/:userId')
router.post('/review/accepted/:requestId')
router.post('/review/rejected/:requestId')
module.exports = router
