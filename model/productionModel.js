const { Schema, model } = require("mongoose");

// Production schema
const productionSchema = new Schema({
  // Add company field
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Ready'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ProductionModel = model("Production", productionSchema);
module.exports = ProductionModel;