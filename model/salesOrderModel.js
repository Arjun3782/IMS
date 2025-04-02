const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salesOrderSchema = new Schema({
  orderId: {
    type: String,
    required: true
  },
  buyerId: {
    type: String,
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  buyerMobile: {
    type: String,
    required: true
  },
  buyerAddress: {
    type: String,
    required: true
  },
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
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  productionId: {
    type: Schema.Types.ObjectId,
    ref: 'Production',
    required: false
  },
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

// Update the updatedAt field on save
salesOrderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const SalesOrderModel = mongoose.model('SalesOrder', salesOrderSchema);
module.exports = SalesOrderModel;