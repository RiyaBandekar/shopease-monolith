const router = require("express").Router();
const c = require("../controllers/orderController");

router.post("/api/orders", c.placeOrder);
router.get("/order-confirmation/:id", c.showOrderConfirmation);

module.exports = router;
