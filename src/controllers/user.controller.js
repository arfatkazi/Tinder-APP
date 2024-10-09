const ConnectionRequest = require("../models/connectionRequest.model");
const User = require("../models/user.model");

// feed controller
const feed = async (req, res) => {
  try {
    const LoggedIn = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipFormula = (page - 1) * limit;
    const requestConnection = await ConnectionRequest.find({
      $or: [{ fromUserId: LoggedIn }, { toUserId: LoggedIn }],
    }).select("fromUserId toUserId status");

    if (!requestConnection || requestConnection.length === 0) {
      return res
        .status(404)
        .json({ message: "request connections not found!" });
    }

    const hideFromFeed = new Set();
    requestConnection.forEach((req) => {
      hideFromFeed.add(req.fromUserId._id.toString());
      hideFromFeed.add(req.toUserId._id.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideFromFeed) } },
        { _id: { $ne: LoggedIn._id } },
      ],
    })
      .select(
        "firstName lastName age height interests bio gender profilePicture "
      )
      .skip(skipFormula)
      .limit(limit);

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not Found!" });
    }
    return res.status(200).json({ message: "show all my feed", users });
  } catch (err) {
    console.error(`Error during feed: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// end of feed controller

//get all the pendin user to see my logged in user

const PendingUserToMyLoginUser = async (req, res) => {
  try {
    const loggedIn = req.user;

    const allPendingUser = await ConnectionRequest.find({
      toUserId: loggedIn._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "height",
      "age",
      "gender",
      "bio",
      "profilePicture",
      "interests",
    ]);

    if (allPendingUser.length === 0) {
      return res.status(404).json({ message: "Request not found!" });
    }

    return res.status(200).json({
      message: "all pending user shown to me !",
      pendingRequests: allPendingUser,
    });
  } catch (err) {
    console.error(`Error during penidng user controller ${err.message}`);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// end of get all the pendin user to see my logged in user

const connectionShown = async (req, res) => {
  try {
    const loggedIn = req.user;
    const requestConnections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedIn, status: "accepted" },
        { toUserId: loggedIn, status: "accepted" },
      ],
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "height",
      "age",
      "gender",
    ]);
    if (requestConnections.length === 0) {
      return res.status(404).json({ message: "No User Connection Found!" });
    }

    const filterFromUserData = requestConnections.map((row) => row.fromUserId);
    return res.status(200).json({ data: filterFromUserData });
  } catch (err) {
    console.error(`Error during connection shown ${err.message}`);
    return res.status(500).json({ message: "Intenral server error" });
  }
};

// get all user controller
// const user = async (req, res) => {
//   try {
//     const user = await User.find({});
//     if (user.length === 0) {
//       return res.status(404).json({ message: "user not found" });
//     }
//     return res.status(200).json({ message: "user found", user: user });
//   } catch (err) {
//     console.log(`Error during user controller : ${err}`);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
//end of  get all user controller

// delete user
const userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(201).json({ message: "user deleted successfully" });
  } catch (err) {
    console.error(`Error during userdelete controller : ${err}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// end of delete user

// updated user
// const userUpdate = async (req, res) => {
//   try {
//     const { id } = req?.params;
//     const updatedData = req?.body;

//     if (
//       updatedData?.email &&
//       !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updatedData?.email)
//     ) {
//       return res.status(400).json({ message: "Invalid email format" });
//     }

//     delete updatedData.email;

//     const updateUser = await User.findByIdAndUpdate(id, updatedData, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updateUser) {
//       return res.status(404).json({ message: "user not found" });
//     }

//     return res
//       .status(200)
//       .json({ message: "user updated sucessfully", user: updateUser });
//   } catch (err) {
//     console.error(`Error during  user update: ${err}`);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
// end of updated user
module.exports = {
  feed,
  PendingUserToMyLoginUser,
  connectionShown,
  userDelete,
};
