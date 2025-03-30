const { Schema, model } = require("mongoose");

// raw material schema
const rawMaterialSchema = new Schema({
  // Add company field
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  s_id: {
    //seller id
    type: Number,
    required: true,
  },
  s_name: {
    type: String,
    required: true,
  },
  ph_no: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  p_id: {
    // product id
    type: Number,
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
  }
});

// Create compound index for unique product IDs within a company
rawMaterialSchema.index({ p_id: 1, companyId: 1 }, { unique: true });

const RawMaterialModel = model("RawMaterial", rawMaterialSchema);
module.exports = RawMaterialModel;