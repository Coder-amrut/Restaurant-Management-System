const express = require('express');
const { z } = require('zod');
const Product = require('../models/Product');
const Order = require('../models/Order');

const router = express.Router();

const customerOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1),
    notes: z.string().max(200).optional()
  })).min(1),
  orderType: z.enum(['Dine-in', 'Takeaway', 'Delivery']).default('Dine-in'),
  tableId: z.string().optional(),
  notes: z.string().max(300).optional(),
  discountAmount: z.number().finite().min(0).default(0)
});

function makeOrderNumber() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}

// GET /api/public/products - Get all available products (supports search & category filter)
router.get('/products', async (req, res, next) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';

    const filter = { isAvailable: true };

    if (category && category.toLowerCase() !== 'all') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

// GET /api/public/categories - Get list of unique available product categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isAvailable: true });
    return res.json(categories.filter(Boolean).sort());
  } catch (error) {
    return next(error);
  }
});

// POST /api/public/orders - Place a new customer order
router.post('/orders', async (req, res, next) => {
  try {
    const parsed = customerOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Invalid order request', errors: parsed.error.flatten() });
    }

    const ids = parsed.data.items.map(item => item.productId);
    const products = await Product.find({ _id: { $in: ids }, isAvailable: true });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    if (products.length !== new Set(ids).size) {
      return res.status(400).json({ message: 'One or more selected items are currently unavailable or invalid.' });
    }

    const items = parsed.data.items.map(item => {
      const product = productMap.get(item.productId);
      return {
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.discountPrice ?? product.price
      };
    });

    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
    const totalAmount = Math.max(0, subtotal + taxAmount - parsed.data.discountAmount);

    const order = await Order.create({
      orderNumber: makeOrderNumber(),
      items,
      totalAmount,
      taxAmount,
      discountAmount: parsed.data.discountAmount,
      orderType: parsed.data.orderType,
      tableId: parsed.data.tableId || null,
      notes: parsed.data.notes || '',
      status: 'Pending'
    });

    return res.status(201).json(order);
  } catch (error) {
    return next(error);
  }
});

// GET /api/public/orders/:id - Live tracking of customer order status
router.get('/orders/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    return next(error);
  }
});

// POST /api/public/seed-demo - Populate sample products if database is empty
router.post('/seed-demo', async (req, res, next) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.json({ message: `Database already contains ${count} dishes.` });
    }

    const sampleProducts = [
      {
        name: "Paneer Butter Masala",
        description: "Cubes of soft cottage cheese simmered in a velvety tomato, butter, and cashew rich gravy.",
        price: 320,
        discountPrice: 290,
        category: "Main Course",
        imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
        prepTime: 20,
        dietaryTags: ["Veg", "Chef Special"],
        allergens: ["Dairy", "Nuts"],
        isAvailable: true
      },
      {
        name: "Chicken Tikka Biryani",
        description: "Fragrant long-grain basmati rice layered with juicy char-grilled chicken tikka and aromatic spices.",
        price: 380,
        category: "Biryani & Rice",
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
        prepTime: 25,
        dietaryTags: ["Non-Veg", "Spicy"],
        allergens: ["Dairy"],
        isAvailable: true
      },
      {
        name: "Crispy Garlic Butter Naan",
        description: "Traditional Indian flatbread freshly baked in tandoor clay oven, topped with crushed garlic & creamy butter.",
        price: 75,
        category: "Breads",
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
        prepTime: 10,
        dietaryTags: ["Veg"],
        allergens: ["Gluten", "Dairy"],
        isAvailable: true
      },
      {
        name: "Classic Masala Dosa",
        description: "Golden crispy fermented rice crepe stuffed with spiced potato mash, served with coconut chutney & sambar.",
        price: 180,
        category: "South Indian",
        imageUrl: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80",
        prepTime: 15,
        dietaryTags: ["Veg", "South Special"],
        allergens: [],
        isAvailable: true
      },
      {
        name: "Tandoori Malai Broccoli",
        description: "Broccoli florets marinated in cream, cheese, and subtle cardamoms, roasted in clay oven to perfection.",
        price: 290,
        discountPrice: 260,
        category: "Starters",
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
        prepTime: 18,
        dietaryTags: ["Veg", "Healthy"],
        allergens: ["Dairy"],
        isAvailable: true
      },
      {
        name: "Mango Lassi",
        description: "Chilled, thick blend of ripe Alphonso mango pulp, fresh yogurt, and a sprinkle of cardamom.",
        price: 130,
        category: "Beverages",
        imageUrl: "https://images.unsplash.com/photo-1571006682860-96f2a2491b49?auto=format&fit=crop&w=600&q=80",
        prepTime: 5,
        dietaryTags: ["Veg", "Refreshing"],
        allergens: ["Dairy"],
        isAvailable: true
      },
      {
        name: "Hot Sizzling Gulab Jamun",
        description: "Mouth-melting fried milk-solid dumplings soaked in warm rose water saffron syrup, served with vanilla ice cream.",
        price: 150,
        category: "Desserts",
        imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
        prepTime: 10,
        dietaryTags: ["Veg", "Sweet"],
        allergens: ["Dairy", "Gluten"],
        isAvailable: true
      }
    ];

    const inserted = await Product.insertMany(sampleProducts);
    return res.status(201).json({ message: `Seeded ${inserted.length} demo dishes into database.`, products: inserted });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
