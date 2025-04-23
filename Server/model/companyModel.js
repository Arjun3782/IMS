const { Schema, model } = require("mongoose");

// Company schema
const companySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CompanyModel = model("Company", companySchema);
module.exports = CompanyModel;