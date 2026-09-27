require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDatabase = require('../src/config/db');
const User = require('../src/models/User');

async function seed() {
  await connectDatabase();
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@restaurant.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const name = process.env.SEED_ADMIN_NAME || 'Bistro Admin';

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { name, email: email.toLowerCase(), password: passwordHash, role: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Admin user seeded successfully: ${user.email} (Password: ${password})`);
  process.exit(0);
}

seed().catch(error => {
  console.error('User seeding failed:', error.message);
  process.exit(1);
});
