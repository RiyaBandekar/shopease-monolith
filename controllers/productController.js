const { Product } = require("../models/Product");

const toView = (d) => ({
  id: d._id.toString(), name: d.name, description: d.description, price: d.price,
  image: d.image, category: d.category, stock: d.stock, featured: d.featured
});

async function showHomePage(req, res) {
  try {
    const docs = await Product.find({ featured: true }).sort({ createdAt: -1 });
    res.render("index", { pageTitle: "Home", architecture: "Monolith", featuredProducts: docs.map(toView) });
  } catch (e) {
    console.error(e);
    res.status(500).send("Could not load the home page.");
  }
}

async function showProductsPage(req, res) {
  try {
    const docs = await Product.find().sort({ createdAt: -1 });
    const categories = (await Product.distinct("category")).sort();
    res.render("products", { pageTitle: "Shop All Products", architecture: "Monolith", products: docs.map(toView), categories });
  } catch (e) {
    console.error(e);
    res.status(500).send("Could not load products.");
  }
}

const showCartPage = (req, res) => res.render("cart", { pageTitle: "Your Cart", architecture: "Monolith" });
const showCheckoutPage = (req, res) => res.render("checkout", { pageTitle: "Checkout", architecture: "Monolith" });

module.exports = { showHomePage, showProductsPage, showCartPage, showCheckoutPage };
