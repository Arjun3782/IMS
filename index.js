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
const companyRoute = require('./routes/companyRoute');
const salesOrderRoute = require('./routes/salesOrderRoute'); // Add this line
const userRoutes = require('./routes/userRoutes');

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
app.use('/api/salesOrder', salesOrderRoute);
app.use('/api/user', userRoutes); // Add this line for user management
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    success: false
  });
});

// Add a health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    serverTime: new Date().toISOString(),
    version: '1.0.0'
  });
});
// Add dashboard routes
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});