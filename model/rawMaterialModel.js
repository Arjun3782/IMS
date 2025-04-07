
const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
  s_id: {
    type: String,
    required: true,
  },
  s_name: {
    type: String,
    required: true,
  },
  ph_no: {
    type: String,
    required: true,
  },
  address: {
    type: String,
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
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

// Create a compound index that ensures uniqueness across company, product, supplier and date
rawMaterialSchema.index(
  { companyId: 1, p_id: 1, s_id: 1, date: 1 },
  { unique: true }
);

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);

module.exports = RawMaterial;