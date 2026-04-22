const jwt = require("jsonwebtoken");

function getTokenPayload(user) {
  return {
    id: user.id,
    username: user.username,
  };
}

function getSecret(primaryKey, fallbackKey) {
  if (process.env[primaryKey]) {
    return process.env[primaryKey];
  }

  if (fallbackKey && process.env[fallbackKey]) {
    return process.env[fallbackKey];
  }

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error(`${primaryKey} is missing for this deployment.`);
  }

  return "change-me";
}

function getAccessTokenSecret() {
  return getSecret("JWT_SECRET");
}

function getRefreshTokenSecret() {
  return getSecret("JWT_REFRESH_SECRET", "JWT_SECRET");
}

function generateAccessToken(user) {
  return jwt.sign(
    getTokenPayload(user),
    getAccessTokenSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    getTokenPayload(user),
    getRefreshTokenSecret(),
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
  );
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshTokenSecret());
}

module.exports = {
  getAccessTokenSecret,
  getRefreshTokenSecret,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
