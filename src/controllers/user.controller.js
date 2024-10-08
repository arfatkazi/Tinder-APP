const User = require("../models/user.model");

// feed controller
const feed = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "email and password are required!" });
    }

    const users = await User.find({ email: { $ne: email } });

    if (users.length === 0) {
      return res.status(404).json("No users found");
    }

    return res.status(200).json({ message: "user found", users: users });
  } catch (err) {
    console.log(`Error during feed: ${err}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// end of feed controller

// get all user controller
const user = async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ message: "user found", user: user });
  } catch (err) {
    console.log(`Error during user controller : ${err}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
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
const userUpdate = async (req, res) => {
  try {
    const { id } = req?.params;
    const updatedData = req?.body;

    if (
      updatedData?.email &&
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updatedData?.email)
    ) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    delete updatedData.email;

    const updateUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updateUser) {
      return res.status(404).json({ message: "user not found" });
    }

    return res
      .status(200)
      .json({ message: "user updated sucessfully", user: updateUser });
  } catch (err) {
    console.error(`Error during  user update: ${err}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// end of updated user
module.exports = {
  feed,
  user,
  userDelete,
  userUpdate,
};
