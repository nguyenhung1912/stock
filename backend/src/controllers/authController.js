const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
  isValidPassword,
} = require("../utils/password");
const { generateAccessToken } = require("../utils/token");

function getUsername(value) {
  return typeof value === "string" ? value.trim() : "";
}

function serializeUser(user) {
  const id =
    typeof user?.id === "string"
      ? user.id
      : typeof user?._id?.toString === "function"
        ? user._id.toString()
        : null;

  return {
    id,
    username: user?.username ?? "",
  };
}

async function register(req, res) {
  try {
    const username = getUsername(req.body.username);
    const password = req.body.password;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const user = await User.create({
      username,
      passwordHash: await hashPassword(password),
    });

    const accessToken = generateAccessToken(user);

    return res.status(201).json({
      user: serializeUser(user),
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot register user" });
  }
}

async function login(req, res) {
  try {
    const username = getUsername(req.body.username);
    const password = req.body.password;

    if (!username || typeof password !== "string") {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username })
      .select("_id username +passwordHash")
      .lean();

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = generateAccessToken(user);

    return res.json({
      user: serializeUser(user),
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot login" });
  }
}

function logout(req, res) {
  return res.json({ message: "Logged out successfully" });
}

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("_id username")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(serializeUser(user));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot get current user" });
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe,
};
