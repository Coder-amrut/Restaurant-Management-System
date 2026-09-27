const express = require('express');
const { z } = require('zod');
const Table = require('../models/Table');
const { requireRole } = require('../middleware/auth');

const router = express.Router();
const tableSchema = z.object({
  name: z.string().trim().min(1).max(40),
  seats: z.number().int().min(1).max(50),
  status: z.enum(['Available', 'Occupied', 'Reserved']).default('Available')
});
const statusSchema = z.object({ status: z.enum(['Available', 'Occupied', 'Reserved']) });

router.get('/', async (req, res, next) => {
  try { return res.json(await Table.find().sort({ name: 1 })); } catch (error) { return next(error); }
});

router.post('/', requireRole('admin', 'staff'), async (req, res, next) => {
  try {
    const parsed = tableSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'A table name and valid seat count are required' });
    return res.status(201).json(await Table.create(parsed.data));
  } catch (error) { return next(error); }
});

router.put('/:id/status', requireRole('admin', 'staff'), async (req, res, next) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Invalid table status' });
    const table = await Table.findByIdAndUpdate(req.params.id, { status: parsed.data.status }, { new: true, runValidators: true });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    return res.json(table);
  } catch (error) { return next(error); }
});

module.exports = router;
