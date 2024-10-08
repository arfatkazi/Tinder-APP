const express = require("express");
const router = express.Router();
const UserAuth = require("../middlewares/auth");
const {
  feed,
  PendingUserToMyLoginUser,
} = require("../controllers/user.controller");

router.get("/requests/recieved", UserAuth, PendingUserToMyLoginUser);
router.get("/connections", UserAuth);
router.get("/feed", UserAuth, feed);

module.exports = router;
