const RawMaterial = require("../Model/rawMaterialModel");

//post raw material
const addRawMaterial = async (req, res) => {
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
    
    console.log("Creating raw material with data:", req.body);
    
    const rawMaterial = await RawMaterial.create(req.body);
    res.status(201).json({
      success: true,
      message: "Raw Material Successfully Added",
      r_data: rawMaterial,
    });
  } catch (error) {
    console.error("Error adding raw material:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

//get raw material
const getRawMaterial = async (req, res) => {
  try {
    // Filter by company ID
    const rawMaterial = await RawMaterial.find({ companyId: req.companyId });
    res.status(200).json({ success: true, r_data: rawMaterial });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//update raw material
const updateRawMaterial = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Ensure the material belongs to the user's company
    const material = await RawMaterial.findOne({ 
      _id: id, 
      companyId: req.companyId 
    });
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Raw Material not found or not authorized"
      });
    }
    
    // Don't allow changing the company ID
    if (req.body.companyId) {
      delete req.body.companyId;
    }
    
    const rawMaterial = await RawMaterial.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    
    res.status(200).json({
      success: true,
      message: "Raw Material Successfully Updated",
      r_data: rawMaterial,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

//delete raw material
const deleteRawMaterial = async (req, res) =>{
  try {
    const id = req.params.id;
    
    // Ensure the material belongs to the user's company
    const material = await RawMaterial.findOne({ 
      _id: id, 
      companyId: req.companyId 
    });
    
    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Raw Material not found or not authorized"
      });
    }
    
    const rawMaterial = await RawMaterial.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Raw Material Successfully Deleted",
      r_data: rawMaterial,
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

module.exports = {
  addRawMaterial,
  getRawMaterial,
  updateRawMaterial,
  deleteRawMaterial
};
