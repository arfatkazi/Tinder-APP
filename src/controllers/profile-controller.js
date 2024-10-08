const User = require("../models/user.model");

// Profileview controller
const Profileview = (req, res) => {
  try {
    const user = req.user; // Use the user data from the token validated in UserAuth

    return res.status(200).json({
      message: "Profile fetched successfully",
      profile: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contact: user.contact,
        gender: user.gender,
        age: user.age,
        height: user.height,
      },
    });
  } catch (err) {
    console.error(`Error during profile view: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// end of Profileview controller

// PROFILE EDIT
const profileEdit = async (req, res) => {
  try {
    const user = req.user;
    const {
      firstName,
      lastName,
      password,
      gender,
      email,
      age,
      contact,
      height,
      profilePicture,
      bio,
      interests,
    } = req.body;

    if (firstName || lastName || password || gender || email) {
      return res.status(400).json({
        message:
          "You cannot change the following fields: firstName, lastName, password, gender, email",
      });
    }
    const editUser = await User.findOneAndUpdate(
      { _id: user._id },
      { age, contact, height, profilePicture, bio, interests },
      { new: true, runValidators: true }
    );

    if (!editUser) {
      return res.status(404).json({ message: "user not found!" });
    }

    return res.status(200).json({
      message: `${user.fullName} your Profile Edited  successfully`,
      profile: {
        id: editUser._id,
        age: editUser.age,
        contact: editUser.contact,
        height: editUser.height,
        profilePicture: editUser.profilePicture,
        bio: editUser.bio,
        interests: editUser.interests,
      },
    });
  } catch (err) {
    console.error(`Error during  edit profile : ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
//END OF  PROFILE EDIT

// forgot the password
const forgotPassword = async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "password is required!" });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(`Error during forgot password controller : ${err.message}`);
    return res.status(500).json({ message: "Inrerval server error." });
  }
};
// end of  forgot the password

module.exports = {
  Profileview,
  profileEdit,
  forgotPassword,
};
