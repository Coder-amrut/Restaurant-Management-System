const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 40 },
  seats: { type: Number, required: true, min: 1, max: 50 },
  status: { type: String, enum: ['Available', 'Occupied', 'Reserved'], default: 'Available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Table', tableSchema);
