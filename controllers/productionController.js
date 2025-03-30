const ProductionModel = require("../Model/productionModel");
const RawMaterialModel = require("../Model/rawMaterialModel");
const ProductModel = require("../Model/productModel");

// Add a new production
const addProduction = async (req, res) => {
  try {
    const { productId, quantity, date, status } = req.body;
    
    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }
    
    // Check if enough raw materials are available
    const rawMaterialUsage = product.rawMaterialUsage;
    let canProduce = true;
    const materialsToUpdate = [];
    
    for (const [materialId, requiredAmount] of Object.entries(rawMaterialUsage)) {
      const totalRequired = requiredAmount * quantity;
      const material = await RawMaterialModel.findById(materialId);
      
      if (!material || material.quantity < totalRequired) {
        canProduce = false;
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
    const productions = await ProductionModel.find();
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
    
    // Check if production exists
    const production = await ProductionModel.findById(id);
    if (!production) {
      return res.status(404).json({
        success: false,
        message: "Production not found"
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