const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function connectDatabase() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/backend",
  );
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}

module.exports = { connectDatabase };
