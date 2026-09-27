require('dotenv').config();
const connectDatabase = require('../src/config/db');
const Product = require('../src/models/Product');

const sampleProducts = [
  {
    name: "Artisan Truffle Wagyu Burger",
    description: "Brioche bun, aged gruyère, caramelized shallots, black summer truffle aioli & crispy fries.",
    price: 350,
    discountPrice: 320,
    category: "Pizzas & Burgers",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    prepTime: 18,
    dietaryTags: ["Non-Veg", "Chef Choice"],
    allergens: ["Gluten", "Dairy", "Egg"],
    isAvailable: true
  },
  {
    name: "Wood-Fired Margherita Bufala",
    description: "Campania buffalo mozzarella, San Marzano tomato reduction, basil, cold-pressed olive oil.",
    price: 300,
    category: "Pizzas & Burgers",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    prepTime: 12,
    dietaryTags: ["Veg"],
    allergens: ["Gluten", "Dairy"],
    isAvailable: true
  },
  {
    name: "Crispy Salt & Pepper Calamari",
    description: "Tender squid rings, smoked sea salt, charred lime wedge & roasted garlic aioli.",
    price: 280,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    dietaryTags: ["Non-Veg"],
    allergens: ["Shellfish", "Gluten"],
    isAvailable: true
  },
  {
    name: "Paneer Butter Masala",
    description: "Cubes of soft cottage cheese simmered in a velvety tomato, butter, and cashew rich gravy.",
    price: 320,
    discountPrice: 290,
    category: "Mains",
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    prepTime: 20,
    dietaryTags: ["Veg", "Chef Choice"],
    allergens: ["Dairy", "Nuts"],
    isAvailable: true
  },
  {
    name: "Chicken Tikka Biryani",
    description: "Fragrant long-grain basmati rice layered with juicy char-grilled chicken tikka and aromatic spices.",
    price: 380,
    category: "Mains",
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    prepTime: 25,
    dietaryTags: ["Non-Veg", "Spicy"],
    allergens: ["Dairy"],
    isAvailable: true
  },
  {
    name: "Tandoori Malai Broccoli",
    description: "Broccoli florets marinated in cream, cheese, and subtle cardamoms, roasted in clay oven to perfection.",
    price: 290,
    discountPrice: 260,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    prepTime: 15,
    dietaryTags: ["Veg", "Healthy"],
    allergens: ["Dairy"],
    isAvailable: true
  },
  {
    name: "Mango Lassi",
    description: "Chilled, thick blend of ripe Alphonso mango pulp, fresh yogurt, and a sprinkle of cardamom.",
    price: 130,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1571006682860-96f2a2491b49?auto=format&fit=crop&w=800&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    prepTime: 10,
    dietaryTags: ["Veg", "Sweet"],
    allergens: ["Dairy", "Gluten"],
    isAvailable: true
  }
];

async function seed() {
  await connectDatabase();
  console.log('Connected to DB. Resetting and seeding structured menu products...');
  
  await Product.deleteMany({});
  const inserted = await Product.insertMany(sampleProducts);
  console.log(`Successfully seeded ${inserted.length} structured artisan dishes into MongoDB!`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
