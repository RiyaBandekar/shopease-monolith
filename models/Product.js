const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, default: 100, min: 0 },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const sampleProducts = [
  { name: "Wireless Bluetooth Headphones", description: "Over-ear wireless headphones with noise cancellation and 30-hour battery life.", price: 2499, image: "https://placehold.co/400x300/2c3e50/ffffff?text=Headphones", category: "Electronics", stock: 50, featured: true },
  { name: "Smart Fitness Watch", description: "Track your steps, heart rate, and sleep with this sleek smart watch.", price: 3299, image: "https://placehold.co/400x300/16a085/ffffff?text=Smart+Watch", category: "Electronics", stock: 40, featured: true },
  { name: "Men's Casual Sneakers", description: "Lightweight and comfortable sneakers perfect for everyday wear.", price: 1799, image: "https://placehold.co/400x300/2980b9/ffffff?text=Sneakers", category: "Fashion", stock: 80, featured: true },
  { name: "Women's Handbag", description: "Elegant handbag made with premium synthetic leather, spacious and stylish.", price: 1499, image: "https://placehold.co/400x300/8e44ad/ffffff?text=Handbag", category: "Fashion", stock: 60, featured: true },
  { name: "Stainless Steel Water Bottle", description: "Double-walled insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours.", price: 599, image: "https://placehold.co/400x300/27ae60/ffffff?text=Water+Bottle", category: "Home & Kitchen", stock: 100, featured: false },
  { name: "Non-Stick Frying Pan", description: "Durable non-stick frying pan, perfect for everyday cooking, easy to clean.", price: 899, image: "https://placehold.co/400x300/d35400/ffffff?text=Frying+Pan", category: "Home & Kitchen", stock: 70, featured: false },
  { name: "Bestseller Novel Collection", description: "A collection of 3 bestselling fiction novels, perfect for weekend reading.", price: 999, image: "https://placehold.co/400x300/c0392b/ffffff?text=Books", category: "Books", stock: 45, featured: false },
  { name: "Yoga Mat", description: "Extra thick anti-slip yoga mat, ideal for yoga, pilates, and floor exercises.", price: 749, image: "https://placehold.co/400x300/f39c12/ffffff?text=Yoga+Mat", category: "Sports & Fitness", stock: 90, featured: true },
  { name: "Bluetooth Portable Speaker", description: "Compact waterproof speaker with rich bass and 10-hour playtime.", price: 1999, image: "https://placehold.co/400x300/34495e/ffffff?text=Speaker", category: "Electronics", stock: 55, featured: false },
  { name: "Classic Analog Wrist Watch", description: "Timeless analog wristwatch with genuine leather strap.", price: 2199, image: "https://placehold.co/400x300/7f8c8d/ffffff?text=Wrist+Watch", category: "Fashion", stock: 35, featured: false }
];

// Inserts sample products only when the collection is empty.
async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`Products collection already has ${count} products - skipping seed.`);
    return;
  }
  await Product.insertMany(sampleProducts);
  console.log(`Seeded ${sampleProducts.length} sample products.`);
}

module.exports = { Product, seedProducts };
