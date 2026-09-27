const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, trim: true, default: '' },
  role: { type: String, enum: ['admin', 'staff', 'customer', 'Customer'], default: 'customer' },
  photoUrl: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
