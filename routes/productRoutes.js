const router = require("express").Router();
const c = require("../controllers/productController");

router.get("/", c.showHomePage);
router.get("/products", c.showProductsPage);
router.get("/cart", c.showCartPage);
router.get("/checkout", c.showCheckoutPage);

module.exports = router;
