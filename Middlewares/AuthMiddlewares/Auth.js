const jwt = require("jsonwebtoken");
const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(403).json({
      message: "Unauthorized, JWT token is missing",
    });
  }
  try { 
    // Extract the token part (remove "Bearer " prefix if present)
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
    
    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_SECRET);  
    
    // Add decoded info to request
    req.user = decode;
    
    // Also add decoded.companyId to req.companyId for consistency with other middleware
    if (decode.companyId) {
      req.companyId = decode.companyId;
    }
    
    // Add the full decoded token to req.decoded for other middleware that expects it
    req.decoded = decode;
    
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).json({
      message: "Unauthorized, JWT token is wrong or expired",
    });
  }
};
module.exports = ensureAuthenticated;