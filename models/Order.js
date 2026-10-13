const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: null },
    productName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    paymentMethod: { type: String, required: true, enum: ["Cash on Delivery", "Dummy Online Payment"] },
    totalAmount: { type: Number, required: true, min: 0 },
    items: {
      type: [orderItemSchema],
      validate: { validator: (v) => v.length > 0, message: "An order needs at least one item." }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
