const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔍 Starting MongoDB connection...");
    console.log("📡 MONGO_URI found:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;