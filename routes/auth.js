// Add this route to your auth.js file
router.post('/refresh', async (req, res) => {
  try {
    // Get the refresh token from the cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token not found' 
      });
    }
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret');
    
    // Find the user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Generate a new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '1h' }
    );
    
    // Send the new access token
    res.json({
      success: true,
      accessToken,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid refresh token' 
    });
  }
});

// Import required modules if not already imported
const jwt = require('jsonwebtoken');
const User = require('../Model/user');
const cookieParser = require('cookie-parser');