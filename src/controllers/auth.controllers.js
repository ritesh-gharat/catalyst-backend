import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import generateToken from "../utils/generateToken.js";

// SignUp controller
const signup = async (req, res) => {
  try {
    // getting the data from user
    const { fullName, username, email, password, confirmPassword, gender } =
      req.body;

    // Check if all required fields are present
    if (
      !username ||
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // checking if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // checking if the user already exists in db
    const existingUser = await User.findOne({ username });

    // if user exists then return "User already exists"
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating the profile picture for the user
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // creating the new user
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
      profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      // generating the token
      generateToken(newUser._id, res);

      // saving the new user to db
      await newUser.save();
      // sending the response to user after saving to db
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // if any error occurs then send the error message
    res.status(500).json({ message: "Something went wrong: Sign-Up" });
    console.error("Error in sign-up:", error);
  }
};

// Login controller
const login = async (req, res) => {
  try {
    // getting the data from user
    const { username, password } = req.body;
    // findind the user in db
    const user = await User.findOne({ username });
    // checking if the user exists and password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    ); // if user is null then password is empty string

    // if the user is not found or password is invalid
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username and password" });
    }

    // if user is found and password is correct then generate token and send data to user
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    // if any error occurs then send the error message
    console.error("Error in login:", error.message);
    res.status(500).json({ error: "Something went wrong: Login" });
  }
};

// Logout controller
const logout = async (req, res) => {
  try {
    // clearing the cookie to logout the user
    res.clearCookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // if any error occurs then send the error message
    console.error("Error in logout:", error.message);
    res.status(500).json({ error: "Something went wrong: Logout" });
  }
};

export { signup, login, logout };