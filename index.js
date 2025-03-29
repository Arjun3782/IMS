const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/db');
const {authDbConn} = require('./config/authdb');
const PORT = process.env.PORT || 5000;
const rawMaterialRoute = require('./routes/rawMaterialRoute');
const authRoutes = require('./routes/AuthRoutes/AuthRouter');

// Connect to databases
authDbConn();
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true // This allows cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser for handling refresh tokens

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rawMaterial', rawMaterialRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    success: false
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});