const express = require('express');
const { z } = require('zod');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const orderSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1), notes: z.string().max(200).optional() })).min(1),
  orderType: z.enum(['Dine-in', 'Takeaway', 'Delivery']).default('Dine-in'),
  tableId: z.string().optional(),
  notes: z.string().max(300).optional(),
  discountAmount: z.number().finite().min(0).default(0)
});
const statusSchema = z.object({ status: z.enum(['Pending', 'Preparing', 'Completed']) });
const allowedTransitions = { Pending: ['Preparing'], Preparing: ['Completed'], Completed: [] };

function makeOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

router.get('/', async (req, res, next) => {
  try { return res.json(await Order.find().sort({ createdAt: -1 })); } catch (error) { return next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (error) { return next(error); }
});

// Any customer, logged in user, or guest can create an order
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const parsed = orderSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'At least one valid order item is required', errors: parsed.error.flatten() });

    const ids = parsed.data.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: ids }, isAvailable: true });
    const productMap = new Map(products.map(product => [product._id.toString(), product]));
    if (products.length !== new Set(ids).size) return res.status(400).json({ message: 'One or more products are missing or unavailable' });

    const items = parsed.data.items.map(item => {
      const product = productMap.get(item.productId);
      return { productId: product._id, productName: product.name, quantity: item.quantity, price: product.discountPrice || product.price };
    });
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
    const totalAmount = Math.max(0, subtotal + taxAmount - parsed.data.discountAmount);
    return res.status(201).json(await Order.create({ orderNumber: makeOrderNumber(), items, totalAmount, taxAmount, discountAmount: parsed.data.discountAmount, orderType: parsed.data.orderType, tableId: parsed.data.tableId, notes: parsed.data.notes || '', status: 'Pending' }));
  } catch (error) { return next(error); }
});

// Admin and staff can update order status
router.put('/:id/status', requireAuth, requireRole('admin', 'staff'), async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Status must be Pending, Preparing, or Completed' });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (parsed.data.status !== order.status && !allowedTransitions[order.status].includes(parsed.data.status)) {
      return res.status(409).json({ message: `Cannot move order from ${order.status} to ${parsed.data.status}` });
    }
    order.status = parsed.data.status;
    return res.json(await order.save());
  } catch (error) { return next(error); }
});

module.exports = router;

