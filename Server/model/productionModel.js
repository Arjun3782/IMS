const mongoose = require('mongoose');

const productionSchema = new mongoose.Schema({
  productionId: {
    type: String,
    required: true,
  },
  productionName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: false, // Changed from required: true to required: false
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Planned',
  },
  materials: [{
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RawMaterial',
      required: true,
    },
    p_id: {
      type: String,
      required: true,
    },
    p_name: {
      type: String,
      required: true,
    },
    quantityUsed: {
      type: Number,
      required: true,
    },
  }],
  outputProduct: {
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitCost: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  notes: {
    type: String,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
}, {
  timestamps: true
});

// Create a compound index for uniqueness
productionSchema.index(
  { companyId: 1, productionId: 1 },
  { unique: true }
);

const Production = mongoose.model('Production', productionSchema);

module.exports = Production;