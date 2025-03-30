const Production = require("../Model/productionModel");
const RawMaterial = require("../Model/rawMaterialModel");

// Add production
// In the addProduction and updateProduction functions, make sure to handle the case where endDate is not provided

// For example, in the addProduction function:
const addProduction = async (req, res) => {
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
    
    console.log("Creating production with data:", req.body);
    
    // Check if materials exist and have sufficient quantity
    if (req.body.materials && req.body.materials.length > 0) {
      for (const material of req.body.materials) {
        const rawMaterial = await RawMaterial.findOne({
          _id: material.materialId,
          companyId: req.body.companyId
        });
        
        if (!rawMaterial) {
          return res.status(404).json({
            success: false,
            error: `Raw material with ID ${material.materialId} not found`
          });
        }
        
        // Check if there's enough quantity
        if (rawMaterial.quantity < material.quantityUsed) {
          return res.status(400).json({
            success: false,
            error: `Insufficient quantity for ${rawMaterial.p_name}. Available: ${rawMaterial.quantity}, Required: ${material.quantityUsed}`
          });
        }
      }
    }
    
    // Create the production record
    const production = await Production.create(req.body);
    
    // Update raw material quantities
    if (req.body.materials && req.body.materials.length > 0) {
      for (const material of req.body.materials) {
        await RawMaterial.findByIdAndUpdate(
          material.materialId,
          { $inc: { quantity: -material.quantityUsed } }
        );
      }
    }
    
    res.status(201).json({
      success: true,
      message: "Production Successfully Added",
      data: production,
    });
  } catch (error) {
    console.error("Error adding production:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Get all productions
const getProductions = async (req, res) => {
  try {
    // Check if companyId is available
    if (!req.companyId) {
      console.error('Company ID not found in request');
      return res.status(400).json({ 
        success: false, 
        error: "Company ID is required but not available" 
      });
    }
    
    console.log('Fetching productions for company:', req.companyId);
    
    // Filter by company ID
    const productions = await Production.find({ companyId: req.companyId });
    
    console.log(`Found ${productions.length} productions`);
    
    res.status(200).json({ success: true, data: productions });
  } catch (error) {
    console.error("Error fetching productions:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Get production by ID
const getProductionById = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Ensure the production belongs to the user's company
    const production = await Production.findOne({ 
      _id: id, 
      companyId: req.companyId 
    });
    
    if (!production) {
      return res.status(404).json({
        success: false,
        message: "Production not found or not authorized"
      });
    }
    
    res.status(200).json({ success: true, data: production });
  } catch (error) {
    console.error("Error fetching production:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Update production
const updateProduction = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Ensure the production belongs to the user's company
    const production = await Production.findOne({ 
      _id: id, 
      companyId: req.companyId 
    });
    
    if (!production) {
      return res.status(404).json({
        success: false,
        message: "Production not found or not authorized"
      });
    }
    
    // Don't allow changing the company ID
    if (req.body.companyId) {
      delete req.body.companyId;
    }
    
    // Update the production
    const updatedProduction = await Production.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    
    res.status(200).json({
      success: true,
      message: "Production Successfully Updated",
      data: updatedProduction,
    });
  } catch (error) {
    console.error("Error updating production:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// Delete production
const deleteProduction = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Ensure the production belongs to the user's company
    const production = await Production.findOne({ 
      _id: id, 
      companyId: req.companyId 
    });
    
    if (!production) {
      return res.status(404).json({
        success: false,
        message: "Production not found or not authorized"
      });
    }
    
    // Delete the production
    await Production.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Production Successfully Deleted"
    });
  } catch (error) {
    console.error("Error deleting production:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = {
  addProduction,
  getProductions,
  getProductionById,
  updateProduction,
  deleteProduction
};