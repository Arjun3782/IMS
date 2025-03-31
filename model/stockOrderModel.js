const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockOrderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expectedDeliveryDate: {
    type: Date
  },
  deliveryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Ordered', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  supplier: {
    name: {
      type: String,
      required: true
    },
    contactPerson: String,
    email: String,
    phone: String
  },
  items: [{
    p_id: {
      type: String,
      required: true
    },
    p_name: {
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
    total: {
      type: Number
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
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

// Pre-save middleware to calculate totals
stockOrderSchema.pre('save', function(next) {
  // Calculate item totals
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.total = item.quantity * item.price;
    });
    
    // Calculate order total
    this.totalAmount = this.items.reduce((sum, item) => sum + (item.total || 0), 0);
  }
  
  // Update the updatedAt timestamp
  this.updatedAt = new Date();
  
  next();
});

// Create a compound index for orderNumber and companyId to ensure uniqueness within a company
stockOrderSchema.index({ orderNumber: 1, companyId: 1 }, { unique: true });

const StockOrderModel = mongoose.model('StockOrder', stockOrderSchema);

module.exports = StockOrderModel;