const StockOrderModel = require('../Model/stockOrderModel');

// Validate stock order data
const validateStockOrder = (req, res, next) => {
  const { orderNumber, supplier, items } = req.body;

  // Check required fields
  if (!orderNumber) {
    return res.status(400).json({
      success: false,
      error: 'Order number is required'
    });
  }

  if (!supplier || !supplier.name) {
    return res.status(400).json({
      success: false,
      error: 'Supplier name is required'
    });
  }

  // Validate items array
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one item is required'
    });
  }

  // Validate each item
  for (const item of items) {
    if (!item.p_id || !item.p_name || !item.quantity || !item.price) {
      return res.status(400).json({
        success: false,
        error: 'Each item must have p_id, p_name, quantity, and price'
      });
    }

    if (item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Item quantity must be greater than zero'
      });
    }

    if (item.price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Item price must be greater than zero'
      });
    }
  }

  next();
};

// Check if order exists
const checkOrderExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req.decoded.companyId;
    
    const order = await StockOrderModel.findOne({ _id: id, companyId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Stock order not found'
      });
    }
    
    // Attach order to request for use in controller
    req.stockOrder = order;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while checking order'
    });
  }
};

// Check for duplicate order number
const checkDuplicateOrderNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.body;
    const companyId = req.decoded.companyId;
    const orderId = req.params.id; // Will be undefined for new orders
    
    // Query to check for duplicate order numbers
    const query = { 
      orderNumber, 
      companyId 
    };
    
    // If updating, exclude the current order
    if (orderId) {
      query._id = { $ne: orderId };
    }
    
    const existingOrder = await StockOrderModel.findOne(query);
    
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        error: 'Order number already exists for this company'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while checking for duplicate order number'
    });
  }
};

module.exports = {
  validateStockOrder,
  checkOrderExists,
  checkDuplicateOrderNumber
};