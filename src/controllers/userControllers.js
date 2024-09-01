const { find, create, findByEmail } = require("../database/userQuerys");
const { hashPassword, comparePassword } = require("../utils/bcryptTools");
const generateToken = require("../utils/generateToken");
const { sendResponse } = require("../utils/sendResponse");

const getUsers = async (req, res) => {
  try {
    const users = await find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: "Error occured: Fetch all Users",
    });
  }
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Required fields missing",
    });
  }
  //hasing password
  const newPassword = await hashPassword(password);

  const user = await findByEmail(email);
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const result = await create(name, email, newPassword);
    return res.status(201).json({ message: "User created", result: result });
  } catch (error) {
    console.log(error.message || "Error occured: Failed to create user");
    return res.status(500).json({
      message: "Error occured",
      error: error.message || "Failed to create user",
    });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const hashPassword = user.password;
      console.log({ hashPassword });
      const passwordIsValid = await comparePassword(password, hashPassword);

      if (!passwordIsValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({
        id: user.id,
        email: user.email,
        name: user.name,
      });

      // If valid, send user data or token
      sendResponse(res, 200, "User logged in ", {
        id: user.id,
        email: user.email,
        name: user.name,
        token:token
      });
    }
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  getUsers,
  createUser,
  signIn,
};
