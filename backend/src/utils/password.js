const { randomBytes, scrypt, timingSafeEqual } = require("crypto");
const { promisify } = require("util");

const PASSWORD_MIN_LENGTH = 6;
const HASH_LENGTH = 64;
const scryptAsync = promisify(scrypt);

function isValidPassword(password) {
  return typeof password === "string" && password.length >= PASSWORD_MIN_LENGTH;
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, HASH_LENGTH)).toString("hex");

  return `${salt}:${hash}`;
}

async function comparePassword(password, hashedPassword) {
  if (typeof password !== "string" || typeof hashedPassword !== "string") {
    return false;
  }

  const [salt, storedHash] = hashedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = (
    await scryptAsync(password, salt, HASH_LENGTH)
  ).toString("hex");
  const storedBuffer = Buffer.from(storedHash, "hex");
  const candidateBuffer = Buffer.from(candidateHash, "hex");

  if (!storedBuffer.length || storedBuffer.length !== candidateBuffer.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, candidateBuffer);
}

module.exports = {
  hashPassword,
  comparePassword,
  isValidPassword,
};
