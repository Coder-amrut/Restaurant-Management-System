const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 300, default: '' },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  imageUrl: { type: String, trim: true, default: '' },
  prepTime: { type: Number, min: 1, max: 240, default: 15 },
  dietaryTags: { type: [String], default: [] },
  allergens: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
