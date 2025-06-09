const mongoose = require('mongoose');

// ✅ Your full MongoDB Atlas connection string
const mongoURI = "mongodb+srv://12240050:mukund@cluster0.ehce7hf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// ✅ Connect function
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop app if DB connection fails
  }
};

module.exports = connectDB;
