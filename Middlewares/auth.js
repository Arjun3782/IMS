const jwt = require('jsonwebtoken');
const User = require('../Model/user');

/**
 * Unified authentication middleware
 * Verifies JWT token and adds user information to request object
 */
const authenticate = async (req, res, next) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    
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
    
    // Add decoded token info for backward compatibility
    req.decoded = decoded;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized, JWT token is wrong or expired' 
    });
  }
};

// Export the middleware with multiple names for backward compatibility
module.exports = authenticate;
module.exports.authMiddleware = authenticate;
module.exports.ensureAuthenticated = authenticate;
module.exports.verifyToken = authenticate;