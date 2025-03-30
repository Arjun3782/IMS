const jwt = require("jsonwebtoken");
const UserModel = require("../Model/user");
const CompanyModel = require("../Model/companyModel");

// Middleware to add company filter to all queries
const companyFilter = async (req, res, next) => {
  try {
    // Get user from the auth middleware
    const userId = req.user.id;
    
    // Find the user to get their company
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Add company name to the request object
    req.companyName = user.company_name;
    
    // Find or create company ID
    let company = await CompanyModel.findOne({ name: user.company_name });
    
    // If company doesn't exist, create it
    if (!company) {
      console.log(`Creating new company: ${user.company_name} for user ${user.name}`);
      company = new CompanyModel({
        name: user.company_name,
        email: user.email
      });
      company = await company.save();
    }
    
    // Add company ID to the request
    req.companyId = company._id;
    console.log(`Set companyId for request: ${req.companyId}`);
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Company filter middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error in company filter"
    });
  }
};

module.exports = companyFilter;