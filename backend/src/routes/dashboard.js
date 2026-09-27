const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Table = require('../models/Table');

const router = express.Router();

router.get('/summary', async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [products, orders, tables, sales] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments({ status: { $ne: 'Completed' } }),
      Table.find().select('status').lean(),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfDay }, status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } }
      ])
    ]);
    const totalSales = sales[0]?.total || 0;
    const completedCount = sales[0]?.count || 0;
    return res.json({
      totalSales,
      activeOrders: orders,
      averageOrderValue: completedCount ? totalSales / completedCount : 0,
      availableTables: tables.filter(table => table.status === 'Available').length,
      totalProducts: products,
      totalTables: tables.length
    });
  } catch (error) { return next(error); }
});

module.exports = router;
