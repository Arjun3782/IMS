const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
module.exports = connectDB;
