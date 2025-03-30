
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

// Drop existing problematic indexes
// This will remove the p_id_1 index
rawMaterialSchema.index({ p_id: 1 }, { unique: false });

// This will remove the p_id_1_companyId_1 index
rawMaterialSchema.index({ p_id: 1, companyId: 1 }, { unique: false });

// Create a new compound index that includes all the fields we need for uniqueness
rawMaterialSchema.index(
  { companyId: 1, p_id: 1, s_id: 1, date: 1 },
  { unique: true }
);

const RawMaterial = mongoose.model('RawMaterial', rawMaterialSchema);

module.exports = RawMaterial;