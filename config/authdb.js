const mongoose = require('mongoose');
const mongoAuth_url = process.env.MONGO_AUTH_URI;

// Create a separate connection for authentication
const authConnection = mongoose.createConnection();

const authDbConn = async () => {
  try {
    await authConnection.openUri(mongoAuth_url);
    console.log("Auth MongoDB connected");
  } catch (error) {
    console.error("Auth MongoDB connection error:", error);
  }
};

// Export both the connection function and the connection object
module.exports = {
  authDbConn,
  authConnection
};