const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'staff'],
    default: 'staff'
  },
  department: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  refreshToken: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Check if the model exists before creating it
const UserModel = mongoose.models.Users || mongoose.model('Users', UserSchema);
module.exports = UserModel;