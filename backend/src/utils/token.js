const jwt = require("jsonwebtoken");

function getTokenPayload(user) {
  const userId =
    typeof user?.id === "string"
      ? user.id
      : typeof user?._id?.toString === "function"
        ? user._id.toString()
        : null;

  return {
    id: userId,
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

module.exports = {
  generateAccessToken,
};
