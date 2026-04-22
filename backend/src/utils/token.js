const jwt = require("jsonwebtoken");

function getTokenPayload(user) {
  return {
    id: user.id,
    username: user.username,
  };
}

function generateAccessToken(user) {
  return jwt.sign(
    getTokenPayload(user),
    process.env.JWT_SECRET || "change-me",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    getTokenPayload(user),
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "change-me",
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
  );
}

function verifyRefreshToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "change-me",
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
