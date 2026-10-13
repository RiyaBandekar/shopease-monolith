// Connects to MongoDB. The connection string comes from .env (MONGODB_URI).
const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopease_monolith";
  try {
    await mongoose.connect(uri);
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection FAILED:", err.message);
    console.error("Is MongoDB running? (docker run -d --name mongodb -p 27017:27017 mongo:8)");
    process.exit(1);
  }
}

module.exports = connectDB;
