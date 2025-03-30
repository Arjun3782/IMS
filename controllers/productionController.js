const ProductionModel = require("../Model/productionModel");
const RawMaterialModel = require("../Model/rawMaterialModel");
const ProductModel = require("../Model/productModel");

// Add a new production
const addProduction = async (req, res) => {
  try {
    const { productId, quantity, date, status } = req.body;
    const companyId = req.companyId;
    
    // Check if product exists and belongs to user's company
    const product = await ProductModel.findOne({ 
      _id: productId, 
      companyId 
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not authorized"
      });
    }
    
    // Check if enough raw materials are available
    const rawMaterialUsage = product.rawMaterialUsage;
    const materialsToUpdate = [];
    
    for (const [materialId, requiredAmount] of Object.entries(rawMaterialUsage)) {
      const totalRequired = requiredAmount * quantity;
      
      // Make sure to check materials from the same company
      const material = await RawMaterialModel.findOne({ 
        _id: materialId,
        companyId
      });
      
      if (!material || material.quantity < totalRequired) {
        return res.status(400).json({
          success: false,
          message: `Not enough ${material ? material.p_name : 'material'} available.`
        });
      }
      
      materialsToUpdate.push({
        _id: materialId,
        quantity: material.quantity - totalRequired
      });
    }
    
    // Create new production
    const newProduction = new ProductionModel({
      productId,
      companyId,
      quantity,
      date,
      status: status || "Pending"
    });
    
    const savedProduction = await newProduction.save();
    
    // Update raw material quantities
    for (const material of materialsToUpdate) {
      await RawMaterialModel.findByIdAndUpdate(
        material._id,
        { quantity: material.quantity }
      );
    }
    
    res.status(201).json(savedProduction);
  } catch (error) {
    console.error("Error adding production:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add production",
      error: error.message
    });
  }
};

// Get all productions
const getProductions = async (req, res) => {
  try {
    // Filter by company ID
    const productions = await ProductionModel.find({ companyId: req.companyId });
    res.status(200).json(productions);
  } catch (error) {
    console.error("Error fetching productions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch productions",
      error: error.message
    });
  }
};

// Update production status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Check if production exists and belongs to user's company
    const production = await ProductionModel.findOne({ 
      _id: id, 
      companyId: req.companyId 
    });
    
    if (!production) {
      return res.status(404).json({
        success: false,
        message: "Production not found or not authorized"
      });
    }
    
    // Update production status
    const updatedProduction = await ProductionModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    res.status(200).json(updatedProduction);
  } catch (error) {
    console.error("Error updating production status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update production status",
      error: error.message
    });
  }
};

module.exports = {
  addProduction,
  getProductions,
  updateStatus
};