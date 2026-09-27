require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

async function testCreateUser() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const email = 'testuser_' + Date.now() + '@example.com';
  const passwordHash = await bcrypt.hash('customer123', 12);

  const newUser = await User.create({
    name: 'Priya Patel',
    email,
    phone: '9876543210',
    password: passwordHash,
    role: 'customer'
  });

  console.log('Successfully created user in MongoDB:');
  console.log(JSON.stringify(newUser, null, 2));

  const totalUsers = await User.countDocuments();
  console.log(`Total users in MongoDB collection: ${totalUsers}`);

  await mongoose.disconnect();
}

testCreateUser().catch(console.error);
