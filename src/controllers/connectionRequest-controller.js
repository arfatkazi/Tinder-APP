const User = require("../models/user.model");
const ConnectionRequest = require("../models/connectionRequest.model");
const mongoose = require("mongoose");
// interested/IgnoreCard card
const interestedIgnoreCard = async (req, res) => {
  try {
    const fromUserId = req.user._id; // Get the sender's ID from the logged-in user
    const toUserId = req.params.toUserId; //// Get the receiver's ID from the URL parameter
    const status = req.path.includes("interested") ? "interested" : "ignored";

    const toUserExist = await User.findById(toUserId);

    if (!toUserExist) {
      return res.status(404).json({ message: "User not found!" });
    }
    const exisitngRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (exisitngRequest) {
      return res.status(400).json({
        message: "Connection request already exist between these users!",
      });
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    return res.status(201).json({
      message: `${req.user.firstName} is ${status} in ${toUserExist.firstName} `,
      data,
    });
  } catch (err) {
    console.error(`Error during interested/ignored card ${err.message} `);

    return res.status(500).json({ message: "Intenral server error" });
  }
};
//end of  interested/IgnoreCard card

//Accepted Rejected card
const AcceptedRejectedCard = async (req, res) => {
  try {
    const fromUserId = req.params.fromUserId; // who request you
    const toUserId = req.user._id; // it is logged in user
    const status = req.path.includes("accepted") ? "accepted" : "rejected";

    const request = await ConnectionRequest.findOne({
      fromUserId,
      toUserId,
      status: "interested",
    });

    if (!request) {
      return res.status(404).json({ message: "Connection request not found!" });
    }

    // const fromUser = await User.findById(fromUserId).select("fullName");

    // if (!fromUser) {
    //   return res.status(404).json({ message: `User not Found!` });
    // }

    request.status = status; // update the request of exisitng user

    const data = await request.save();

    return res.status(201).json({
      message: `${req.user.fullName} has ${status} the connection request  successfully`,
      data,
    });
  } catch (err) {
    console.error(`Error during accepted/rejected controller : ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//end of Accepted Rejected card

module.exports = {
  interestedIgnoreCard,
  AcceptedRejectedCard,
};
