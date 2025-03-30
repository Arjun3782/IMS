const jwt = require('jsonwebtoken');
const User = require('../Model/user');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided or invalid token format' 
      });
    }
    
    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    // Verify token
    console.log('Verifying token:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    console.log('Token decoded successfully:', decoded);
    
    // Find user by id
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Add user info to request
    req.user = user;
    req.userId = user._id;
    req.companyId = user.companyId || decoded.companyId;
    
    console.log('User authenticated:', user._id, 'Company ID:', req.companyId);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized, JWT token is wrong or expired' 
    });
  }
};

module.exports = authMiddleware;