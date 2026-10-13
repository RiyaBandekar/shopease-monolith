const Order = require("../models/Order");
const { Product } = require("../models/Product");

// POST /api/orders  - the monolith talks to the Product and Order models directly (same process).
async function placeOrder(req, res) {
  try {
    const { customerName, phone, address, paymentMethod, items } = req.body;
    if (!customerName || !phone || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Please fill in all customer details." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    // Prices are re-read from the database so the client cannot change them.
    const lines = [];
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.id).catch(() => null);
      const quantity = parseInt(item.quantity, 10);
      if (!product || !(quantity >= 1)) {
        return res.status(400).json({ success: false, message: "One of the products in your cart is invalid." });
      }
      lines.push({ productId: product._id.toString(), productName: product.name, price: product.price, quantity });
      totalAmount += product.price * quantity;
    }

    const order = await Order.create({ customerName, phone, address, paymentMethod, totalAmount, items: lines });
    res.json({ success: true, orderId: order._id.toString() });
  } catch (e) {
    console.error("Error placing order:", e);
    const status = e.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ success: false, message: status === 400 ? e.message : "Could not place your order." });
  }
}

// GET /order-confirmation/:id
async function showOrderConfirmation(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found.");
    res.render("order-confirmation", {
      pageTitle: "Order Confirmation",
      architecture: "Monolith",
      order: {
        id: order._id.toString(), customer_name: order.customerName, phone: order.phone,
        address: order.address, payment_method: order.paymentMethod,
        total_amount: order.totalAmount, created_at: order.createdAt.toLocaleString()
      },
      items: order.items.map((i) => ({ product_name: i.productName, price: i.price, quantity: i.quantity }))
    });
  } catch (e) {
    res.status(404).send("Order not found.");
  }
}

module.exports = { placeOrder, showOrderConfirmation };
