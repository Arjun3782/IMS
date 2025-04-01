const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
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
    required: true,
    min: 0
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  productionId: {
    type: Schema.Types.ObjectId,
    ref: 'Production',
    required: false
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  source: {
    type: String,
    enum: ['production', 'purchase', 'adjustment'],
    default: 'production'
  },
  notes: String,
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamps
stockSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create a compound index for productId and companyId
stockSchema.index({ productId: 1, companyId: 1 });

const StockModel = mongoose.model('Stock', stockSchema);

module.exports = StockModel;