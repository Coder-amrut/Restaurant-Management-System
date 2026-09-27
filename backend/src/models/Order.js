const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  items: { type: [orderItemSchema], required: true, validate: value => value.length > 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  orderType: { type: String, enum: ['Dine-in', 'Takeaway', 'Delivery'], default: 'Dine-in' },
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  notes: { type: String, trim: true, maxlength: 300, default: '' },
  taxAmount: { type: Number, min: 0, default: 0 },
  discountAmount: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['Pending', 'Preparing', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
