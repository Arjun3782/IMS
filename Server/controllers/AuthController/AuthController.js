const UserModel = require("../../Model/user");
const CompanyModel = require("../../Model/companyModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { name, email, password, company_name, role, phone } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    // Check if company exists, if not create it
    let company = await CompanyModel.findOne({ name: company_name });
    
    if (!company) {
      // Create new company
      company = new CompanyModel({
        name: company_name,
        email: email,
        phone: phone
      });
      
      company = await company.save();
      console.log(`Created new company: ${company_name} with ID: ${company._id}`);
    }

    // Create user with company ID reference (removed department)
    const userModel = new UserModel({
      name,
      email,
      password,
      company_name,
      companyId: company._id,
      role: role || 'staff',
      phone
    });
    
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    
    // Generate token for immediate login
    const token = generateAccessToken(userModel);
    
    return res.status(201).json({ 
      message: "User created successfully", 
      success: true,
      accessToken: token,
      user: {
        id: userModel._id,
        name: userModel.name,
        email: userModel.email,
        company_name: userModel.company_name,
        companyId: company._id.toString(),
        role: userModel.role
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      company_name: user.company_name,
      companyId: user.companyId.toString() 
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Shorter expiration for access tokens
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } // Longer expiration for refresh tokens
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed email or password is incorrect";
    if (!user) {
      return res.status(403).json({
        message: errorMsg,
        success: false,
      });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: errorMsg,
        success: false,
      });
    }

    // Check if user has companyId, if not, find or create company
    if (!user.companyId) {
      let company = await CompanyModel.findOne({ name: user.company_name });
      
      if (!company) {
        // Create company if it doesn't exist
        company = new CompanyModel({
          name: user.company_name,
          email: user.email,
          phone: user.phone
        });
        company = await company.save();
      }
      
      // Update user with company ID
      user.companyId = company._id;
      await user.save();
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict'
    });

    // In the login function, update the response
    return res.status(200).json({
      message: "Login Success",
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        company_name: user.company_name,
        companyId: user.companyId.toString(),
        phone: user.phone
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required", success: false });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user with matching refresh token
    const user = await UserModel.findOne({ _id: decoded.id, refreshToken });
    
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token", success: false });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);
    
    return res.status(200).json({
      message: "Token refreshed successfully",
      success: true,
      accessToken
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Invalid refresh token", success: false });
    }
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

const logout = async (req, res) => {
  try {
    // Get refresh token from cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      // Find user with this refresh token and clear it
      await UserModel.findOneAndUpdate(
        { refreshToken },
        { $set: { refreshToken: null } }
      );
    }
    
    // Clear the cookie
    res.clearCookie('refreshToken');
    
    return res.status(200).json({
      message: "Logged out successfully",
      success: true
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout
};
