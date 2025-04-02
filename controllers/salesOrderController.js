const SalesOrderModel = require('../Model/salesOrderModel');
const StockModel = require('../Model/stockModel');

// Create a new sales order
const createSalesOrder = async (req, res) => {
  try {
    // Check if companyId is already in the request body
    if (!req.body.companyId && req.companyId) {
      // Add company ID from middleware if not already present
      req.body.companyId = req.companyId;
    }
    
    // Additional validation to ensure companyId exists
    if (!req.body.companyId) {
      return res.status(400).json({ 
        success: false, 
        error: "Company ID is required but not provided" 
      });
    }
    
    // Generate a unique order ID if not provided
    if (!req.body.orderId) {
      req.body.orderId = 'SO-' + Date.now();
    }
    
    console.log("Creating sales order with data:", req.body);
    
    // Create the sales order
    const salesOrder = new SalesOrderModel(req.body);
    await salesOrder.save();
    
    // Update stock quantity
    await updateStockQuantity(req.body.productId, req.body.quantity, req.companyId);
    
    res.status(201).json({
      success: true,
      message: "Sales order created successfully",
      data: salesOrder
    });
  } catch (error) {
    console.error("Error creating sales order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create sales order",
      error: error.message
    });
  }
};

// Get all sales orders for a company
const getSalesOrders = async (req, res) => {
  try {
    const salesOrders = await SalesOrderModel.find({ companyId: req.companyId })
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: salesOrders.length,
      data: salesOrders
    });
  } catch (error) {
    console.error("Error fetching sales orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales orders",
      error: error.message
    });
  }
};

// Get a single sales order by ID
const getSalesOrderById = async (req, res) => {
  try {
    const salesOrder = await SalesOrderModel.findOne({
      _id: req.params.id,
      companyId: req.companyId
    });
    
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: "Sales order not found"
      });
    }
    
    res.status(200).json({
      success: true,
      data: salesOrder
    });
  } catch (error) {
    console.error("Error fetching sales order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales order",
      error: error.message
    });
  }
};

// Update a sales order
const updateSalesOrder = async (req, res) => {
  try {
    // Find the existing order to get the original quantity
    const existingOrder = await SalesOrderModel.findOne({
      _id: req.params.id,
      companyId: req.companyId
    });
    
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Sales order not found"
      });
    }
    
    // Calculate the quantity difference
    const quantityDifference = req.body.quantity - existingOrder.quantity;
    
    // Update the sales order
    const salesOrder = await SalesOrderModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    // Update stock quantity if quantity has changed
    if (quantityDifference !== 0) {
      await updateStockQuantity(existingOrder.productId, -quantityDifference, req.companyId);
    }
    
    res.status(200).json({
      success: true,
      message: "Sales order updated successfully",
      data: salesOrder
    });
  } catch (error) {
    console.error("Error updating sales order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update sales order",
      error: error.message
    });
  }
};

// Delete a sales order
const deleteSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrderModel.findOne({
      _id: req.params.id,
      companyId: req.companyId
    });
    
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: "Sales order not found"
      });
    }
    
    // Return the quantity to stock
    await updateStockQuantity(salesOrder.productId, salesOrder.quantity, req.companyId);
    
    // Delete the sales order
    await SalesOrderModel.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: "Sales order deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting sales order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete sales order",
      error: error.message
    });
  }
};

// Helper function to update stock quantity
async function updateStockQuantity(productId, quantity, companyId) {
  try {
    // Find the stock item
    const stockItem = await StockModel.findOne({ 
      productId: productId,
      companyId: companyId
    });
    
    if (!stockItem) {
      throw new Error(`Stock item with product ID ${productId} not found`);
    }
    
    // Update the quantity (subtract for sales)
    stockItem.quantity -= quantity;
    
    // Ensure quantity doesn't go below zero
    if (stockItem.quantity < 0) {
      throw new Error(`Insufficient stock for product ${productId}`);
    }
    
    // Update the total cost
    stockItem.totalCost = stockItem.quantity * stockItem.unitCost;
    
    // Save the updated stock item
    await stockItem.save();
    
    console.log(`Updated stock for product ${productId}: new quantity = ${stockItem.quantity}`);
  } catch (error) {
    console.error("Error updating stock quantity:", error);
    throw error;
  }
}

module.exports = {
  createSalesOrder,
  getSalesOrders,
  getSalesOrderById,
  updateSalesOrder,
  deleteSalesOrder
};