const CompanyModel = require("../Model/companyModel");
const UserModel = require("../Model/user");

// Create a new company
const createCompany = async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    
    // Check if company with same name already exists
    const existingCompany = await CompanyModel.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company with this name already exists"
      });
    }
    
    // Create new company
    const newCompany = new CompanyModel({
      name,
      address,
      phone,
      email
    });
    
    const savedCompany = await newCompany.save();
    
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company: savedCompany
    });
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create company",
      error: error.message
    });
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await CompanyModel.find();
    res.status(200).json({
      success: true,
      companies
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
      error: error.message
    });
  }
};

// Get company by ID
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const company = await CompanyModel.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    res.status(200).json({
      success: true,
      company
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company",
      error: error.message
    });
  }
};

// Update company
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, email } = req.body;
    
    // Check if company exists
    const company = await CompanyModel.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    // If name is being changed, check for duplicates
    if (name && name !== company.name) {
      const existingCompany = await CompanyModel.findOne({ name });
      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: "Company with this name already exists"
        });
      }
    }
    
    // Update company
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      id,
      { name, address, phone, email },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany
    });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update company",
      error: error.message
    });
  }
};

// Delete company
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if company exists
    const company = await CompanyModel.findById(id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found"
      });
    }
    
    // Delete company
    await CompanyModel.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Company deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete company",
      error: error.message
    });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
};