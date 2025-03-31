const StockOrderModel = require('../Model/stockOrderModel');
const RawMaterialModel = require('../Model/rawMaterialModel');

// Get all stock orders for a company
exports.getStockOrders = async (req, res) => {
  try {
    // Update to access companyId from decoded token
    const companyId = req.decoded.companyId;
    
    const stockOrders = await StockOrderModel.find({ companyId }).sort({ orderDate: -1 });
    
    res.status(200).json({
      success: true,
      count: stockOrders.length,
      data: stockOrders
    });
  } catch (error) {
    console.error('Error fetching stock orders:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add a new stock order
exports.addStockOrder = async (req, res) => {
  try {
    // Update to access companyId from decoded token
    const companyId = req.decoded.companyId;
    
    // Check if order number already exists for this company
    const existingOrder = await StockOrderModel.findOne({ 
      orderNumber: req.body.orderNumber,
      companyId
    });
    
    if (existingOrder) {
      return res.status(400).json({
        success: false,
        error: 'Order number already exists for this company'
      });
    }
    
    // Create new stock order
    const stockOrder = new StockOrderModel({
      ...req.body,
      companyId
    });
    
    await stockOrder.save();
    
    // If the order is marked as delivered, update inventory
    if (stockOrder.status === 'Delivered') {
      await updateInventory(stockOrder);
    }
    
    res.status(201).json({
      success: true,
      data: stockOrder
    });
  } catch (error) {
    console.error('Error adding stock order:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update a stock order
exports.updateStockOrder = async (req, res) => {
  try {
    // Update to access companyId from decoded token
    const companyId = req.decoded.companyId;
    const { id } = req.params;
    
    // Find the existing order
    const existingOrder = await StockOrderModel.findOne({ _id: id, companyId });
    
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        error: 'Stock order not found'
      });
    }
    
    // Check if order number is being changed and already exists
    if (req.body.orderNumber && req.body.orderNumber !== existingOrder.orderNumber) {
      const duplicateOrder = await StockOrderModel.findOne({
        orderNumber: req.body.orderNumber,
        companyId,
        _id: { $ne: id }
      });
      
      if (duplicateOrder) {
        return res.status(400).json({
          success: false,
          error: 'Order number already exists for this company'
        });
      }
    }
    
    // Get the previous status
    const previousStatus = existingOrder.status;
    
    // Update the order
    const updatedOrder = await StockOrderModel.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    // If status changed to Delivered, update inventory
    if (previousStatus !== 'Delivered' && updatedOrder.status === 'Delivered') {
      await updateInventory(updatedOrder);
    }
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating stock order:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete a stock order
exports.deleteStockOrder = async (req, res) => {
  try {
    // Update to access companyId from decoded token
    const companyId = req.decoded.companyId;
    const { id } = req.params;
    
    const stockOrder = await StockOrderModel.findOne({ _id: id, companyId });
    
    if (!stockOrder) {
      return res.status(404).json({
        success: false,
        error: 'Stock order not found'
      });
    }
    
    // Don't allow deletion of delivered orders that have updated inventory
    if (stockOrder.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete delivered orders. Please cancel instead.'
      });
    }
    
    await StockOrderModel.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting stock order:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Helper function to update inventory when an order is delivered
async function updateInventory(stockOrder) {
  try {
    // Process each item in the order
    for (const item of stockOrder.items) {
      // Find existing raw material with the same p_id for this company
      let rawMaterial = await RawMaterialModel.findOne({ 
        p_id: item.p_id,
        companyId: stockOrder.companyId
      });
      
      if (rawMaterial) {
        // Update existing material quantity
        rawMaterial.quantity += item.quantity;
        rawMaterial.total_price = rawMaterial.price * rawMaterial.quantity;
        await rawMaterial.save();
      } else {
        // Create new raw material entry
        const newRawMaterial = new RawMaterialModel({
          p_id: item.p_id,
          p_name: item.p_name,
          quantity: item.quantity,
          price: item.price,
          total_price: item.quantity * item.price,
          date: new Date(),
          companyId: stockOrder.companyId,
          s_id: 'STOCK-' + Date.now(),
          s_name: stockOrder.supplier.name,
          ph_no: stockOrder.supplier.phone || 'N/A',
          address: 'From stock order #' + stockOrder.orderNumber
        });
        
        await newRawMaterial.save();
      }
    }
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw new Error('Failed to update inventory: ' + error.message);
  }
}