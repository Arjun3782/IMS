const ProductModel = require("../Model/productModel");
const StockModel = require("../Model/stockModel");

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { productId, productName, rawMaterialUsage } = req.body;
    
    // Add company ID from middleware
    const companyId = req.companyId;
    
    // Check if product with same ID already exists in this company
    const existingProduct = await ProductModel.findOne({ 
      productId, 
      companyId 
    });
    
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this ID already exists in your company"
      });
    }
    
    // Create new product
    const newProduct = new ProductModel({
      productId,
      productName,
      companyId,
      rawMaterialUsage
    });
    
    const savedProduct = await newProduct.save();
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message
    });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    // Filter by company ID
    const products = await ProductModel.find({ companyId: req.companyId });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, productName, rawMaterialUsage } = req.body;
    
    // Check if product exists and belongs to user's company
    const product = await ProductModel.findOne({ 
      _id: id, 
      companyId: req.companyId 
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not authorized"
      });
    }
    
    // Don't allow changing the company ID
    const updateData = {
      productId,
      productName,
      rawMaterialUsage
    };
    
    // Update product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists and belongs to user's company
    const product = await ProductModel.findOne({ 
      _id: id, 
      companyId: req.companyId 
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not authorized"
      });
    }
    
    // Delete product
    await ProductModel.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
};

// Add completed production to products
const addCompletedProduction = async (req, res) => {
  try {
    const { production } = req.body;
    
    if (!production || !production.outputProduct) {
      return res.status(400).json({
        success: false,
        message: "Invalid production data"
      });
    }
    
    // Add company ID from middleware
    const companyId = req.companyId;
    
    // First, check if the product exists
    let product = await ProductModel.findOne({ 
      productId: production.outputProduct.productId,
      companyId 
    });
    
    // If product doesn't exist, create it
    if (!product) {
      product = new ProductModel({
        productId: production.outputProduct.productId,
        productName: production.outputProduct.productName,
        companyId,
        rawMaterialUsage: {}
      });
      
      // Add raw material usage data if available
      if (production.materials && production.materials.length > 0) {
        production.materials.forEach(material => {
          product.rawMaterialUsage.set(material.p_id, material.quantityUsed);
        });
      }
      
      await product.save();
    }
    
    // Now add to stock
    const stockEntry = new StockModel({
      productId: production.outputProduct.productId,
      productName: production.outputProduct.productName,
      quantity: production.outputProduct.quantity,
      unitCost: production.outputProduct.unitCost,
      totalCost: production.outputProduct.totalCost,
      productionId: production._id,
      date: new Date(),
      source: 'production',
      notes: `Produced from production ${production.productionName}`,
      companyId
    });
    
    const savedStock = await stockEntry.save();
    
    res.status(201).json({
      success: true,
      message: "Production added to stock successfully",
      data: savedStock
    });
  } catch (error) {
    console.error("Error adding production to stock:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add production to stock",
      error: error.message
    });
  }
};

// Add this function to get stock
const getStock = async (req, res) => {
  try {
    // Filter by company ID
    const stock = await StockModel.find({ companyId: req.companyId });
    res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock",
      error: error.message
    });
  }
};

// Add this function to add directly to stock
const addToStock = async (req, res) => {
  try {
    const stockData = req.body;
    
    // Add company ID from middleware
    stockData.companyId = req.companyId;
    
    // Create new stock entry
    const stockEntry = new StockModel(stockData);
    const savedStock = await stockEntry.save();
    
    res.status(201).json({
      success: true,
      message: "Item added to stock successfully",
      data: savedStock
    });
  } catch (error) {
    console.error("Error adding to stock:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add to stock",
      error: error.message
    });
  }
};

// Make sure to export the new functions
module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addCompletedProduction,
  getStock,
  addToStock
};