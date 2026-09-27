const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const User = require('../models/User');

const router = express.Router();
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});
const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(4).max(128),
  phone: z.string().trim().optional().default(''),
  role: z.enum(['admin', 'staff', 'customer', 'Customer']).optional().default('customer')
});

function createToken(user) {
  return jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, phone: user.phone || '', role: user.role, photoUrl: user.photoUrl || '' };
}

router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Valid email and password are required' });

    const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: 'Name, valid email, and a password of at least 4 characters are required' });

    const email = parsed.data.email.toLowerCase();
    const existingUser = await User.exists({ email });
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists' });

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await User.create({
      name: parsed.data.name,
      email,
      password: passwordHash,
      phone: parsed.data.phone || '',
      role: parsed.data.role || 'customer'
    });
    return res.status(201).json({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ message: 'An account with this email already exists' });
    return next(error);
  }
});

router.put('/profile', async (req, res, next) => {
  try {
    const { name, photoUrl, userId } = req.body;
    let query = {};
    if (userId) {
      query._id = userId;
    } else {
      query.email = 'admin@restaurant.com';
    }
    const updateData = {};
    if (name) updateData.name = name;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;

    const user = await User.findOneAndUpdate(query, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User profile not found' });
    }
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
