const UserModel = require("../Model/user");
const bcrypt = require("bcrypt");

// Get all users for a company
const getUsers = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    // Verify the requesting user has access to this company
    if (req.user.role !== 'admin' && req.companyId.toString() !== companyId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to access users from this company"
      });
    }
    
    const users = await UserModel.find({ companyId }).select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

// Register a new user (for admin use)
const register = async (req, res) => {
  try {
    const { name, email, password, company_name, role, phone, companyId } = req.body;
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists"
      });
    }
    
    // Verify the requesting user has access to this company
    if (req.user.role !== 'admin' && req.companyId.toString() !== companyId) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to add users to this company"
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      company_name,
      companyId,
      role: role || 'staff',
      phone
    });
    
    const savedUser = await newUser.save();
    
    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message
    });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, company_name, role, phone } = req.body;
    
    // Find the user to update
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Verify the requesting user has access to this user's company
    if (req.user.role !== 'admin' && req.companyId.toString() !== user.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this user"
      });
    }
    
    // Prepare update data
    const updateData = {
      name: name || user.name,
      email: email || user.email,
      company_name: company_name || user.company_name,
      role: role || user.role,
      phone: phone || user.phone
    };
    
    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message
    });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the user to delete
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Verify the requesting user has access to this user's company
    if (req.user.role !== 'admin' && req.companyId.toString() !== user.companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this user"
      });
    }
    
    // Delete user
    await UserModel.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
};

module.exports = {
  getUsers,
  register,
  updateUser,
  deleteUser
};