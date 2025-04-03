// Add this new route to your rawMaterialRoutes.js file

// Update quantities of multiple raw materials (reduce quantities for production)
router.post('/updateQuantities', authenticateToken, async (req, res) => {
  try {
    const { materials } = req.body;
    
    if (!materials || !Array.isArray(materials)) {
      return res.status(400).json({ error: 'Invalid materials data' });
    }
    
    // Process each material update
    for (const material of materials) {
      const { materialId, quantityUsed } = material;
      
      // Find the raw material by ID
      const rawMaterial = await RawMaterial.findById(materialId);
      
      if (!rawMaterial) {
        return res.status(404).json({ error: `Material with ID ${materialId} not found` });
      }
      
      // Check if there's enough quantity
      if (rawMaterial.quantity < quantityUsed) {
        return res.status(400).json({ 
          error: `insufficient quantity for ${rawMaterial.p_name}. Available: ${rawMaterial.quantity}, Required: ${quantityUsed}` 
        });
      }
      
      // Update the quantity
      rawMaterial.quantity -= quantityUsed;
      
      // Save the updated material
      await rawMaterial.save();
    }
    
    res.status(200).json({ message: 'Raw material quantities updated successfully' });
  } catch (error) {
    console.error('Error updating raw material quantities:', error);
    res.status(500).json({ error: error.message });
  }
});