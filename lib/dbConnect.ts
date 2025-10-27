import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("⚠️ Please add your MongoDB URI to .env.local");
  }

  if (isConnected || mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    console.log("🔹 Connecting to DB...");

    await mongoose.connect(uri, {
      dbName: "datafor10gpa",
      serverSelectionTimeoutMS: 10000, // 10 seconds
      connectTimeoutMS: 10000,
      tls: true, // replaces old "ssl" option
    });

    isConnected = true;
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}
