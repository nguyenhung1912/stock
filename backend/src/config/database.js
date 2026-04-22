const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
let connectionPromise = null;

function getMongoUri() {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    throw new Error("MONGODB_URI is missing for this deployment.");
  }

  return "mongodb://127.0.0.1:27017/backend";
}

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(getMongoUri())
      .then((mongooseInstance) => {
        console.log(`MongoDB connected: ${mongooseInstance.connection.name}`);
        return mongooseInstance.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = { connectDatabase };
