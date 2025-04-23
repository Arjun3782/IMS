const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitCost: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  productionId: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['production', 'manual', 'import'],
    default: 'manual'
  },
  notes: {
    type: String
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);