const ProductModel = require("../Model/productModel");

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

module.exports = {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
};