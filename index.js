const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const connectDB = require('./Config/db');
const {authDbConn} = require('./config/authdb');
const PORT = process.env.PORT || 5000;
const rawMaterialRoute = require('./routes/rawMaterialRoute');
authDbConn();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/rawMaterial', rawMaterialRoute);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});