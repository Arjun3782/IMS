const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/db');
const {authDbConn} = require('./Config/authdb');
const PORT = process.env.PORT || 5000;
const rawMaterialRoute = require('./routes/rawMaterialRoute');
const authRoutes = require('./routes/AuthRoutes/AuthRouter');
const productRoute = require('./routes/productRoute');
const productionRoute = require('./routes/productionRoute');
const stockOrderRoutes = require('./routes/stockOrderRoutes');
// Remove this line since we'll include it in authRoutes
// const refreshTokenRoute = require('./routes/auth/refreshToken');
const companyRoute = require('./routes/companyRoute');

// Connect to databases
authDbConn();
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true // This allows cookies to be sent with requests
}));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser for handling refresh tokens

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rawMaterial', rawMaterialRoute);
app.use('/api/product', productRoute);
app.use('/api/production', productionRoute);
app.use('/api/company', companyRoute);

// Remove this line since we're already using authRoutes for /api/auth
// app.use('/api/auth', refreshTokenRoute);
app.use('/api/stockorder', stockOrderRoutes);
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