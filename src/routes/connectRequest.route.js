const express = require('express')
const router = express.Router()
const UserAuth = require('../middlewares/auth')
const {
  interestedIgnoreCard,
  AcceptedRejectedCard,
} = require('../controllers/user.controller')

router.post('/request/send/:status/:toUserId', UserAuth, interestedIgnoreCard) //my interested request go to reciever id to other user

router.post(
  '/request/review/:status/:fromUserId',
  UserAuth,
  AcceptedRejectedCard
) // another user send / sender id  send   me  request to me   i will check if i want to accepted it or not

module.exports = router
