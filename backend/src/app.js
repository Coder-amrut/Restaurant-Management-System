require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { requireAuth } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const tableRoutes = require('./routes/tables');
const dashboardRoutes = require('./routes/dashboard');

const publicRoutes = require('./routes/public');

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : true;

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', requireAuth, tableRoutes);
app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
