const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
  isValidPassword,
} = require("../utils/password");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/token");

function getUsername(value) {
  return typeof value === "string" ? value.trim() : "";
}

async function saveRefreshToken(user) {
  const refreshToken = generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  return refreshToken;
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
      passwordHash: hashPassword(password),
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = await saveRefreshToken(user);

    return res.status(201).json({
      user,
      accessToken,
      refreshToken,
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

    const user = await User.findOne({ username }).select("+passwordHash +refreshToken");

    if (!user || !comparePassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await saveRefreshToken(user);

    return res.json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot login" });
  }
}

async function refreshToken(req, res) {
  try {
    const currentRefreshToken = req.body.refreshToken;

    if (typeof currentRefreshToken !== "string" || !currentRefreshToken.trim()) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const payload = verifyRefreshToken(currentRefreshToken);
    const user = await User.findById(payload.id).select("+refreshToken");

    if (!user || user.refreshToken !== currentRefreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await saveRefreshToken(user);

    return res.json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}

async function logout(req, res) {
  try {
    const user = await User.findById(req.user.id).select("+refreshToken");

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot logout" });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot get current user" });
  }
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
};
