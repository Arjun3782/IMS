const { Schema, model } = require("mongoose");

// Product schema
const productSchema = new Schema({
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  // Add company field to associate products with companies
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',  // Assuming you'll create a Company model
    required: true
  },
  rawMaterialUsage: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for productId and companyId to ensure uniqueness within a company
productSchema.index({ productId: 1, companyId: 1 }, { unique: true });

const ProductModel = model("Product", productSchema);
module.exports = ProductModel;