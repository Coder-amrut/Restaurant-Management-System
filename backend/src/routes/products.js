const express = require('express');
const { z } = require('zod');
const Product = require('../models/Product');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
const productSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(300).default(''),
  price: z.number().finite().min(0),
  discountPrice: z.number().finite().min(0).optional(),
  category: z.string().trim().min(1).max(80),
  imageUrl: z.string().trim().default(''),
  prepTime: z.number().int().min(1).max(240).default(15),
  dietaryTags: z.array(z.string().trim().min(1).max(30)).default([]),
  allergens: z.array(z.string().trim().min(1).max(30)).default([]),
  isAvailable: z.boolean().default(true)
});

router.get('/', async (req, res, next) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const filter = search ? { $or: [{ name: new RegExp(search, 'i') }, { category: new RegExp(search, 'i') }] } : {};
    return res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (error) { return next(error); }
});

router.post('/', requireAuth, requireRole('admin', 'staff'), async (req, res, next) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Invalid product data', errors: parsed.error.flatten() });
    return res.status(201).json(await Product.create(parsed.data));
  } catch (error) { return next(error); }
});

router.put('/:id', requireAuth, requireRole('admin', 'staff'), async (req, res, next) => {
  try {
    const parsed = productSchema.partial().safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Invalid product data', errors: parsed.error.flatten() });
    const product = await Product.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) { return next(error); }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(204).send();
  } catch (error) { return next(error); }
});

module.exports = router;
