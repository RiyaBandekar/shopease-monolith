// ShopEase - MONOLITHIC version: one Express app, one codebase, one database.
require("dotenv").config();
const express = require("express");
const path = require("path");

const connectDB = require("./config/database");
const { seedProducts } = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/productRoutes"));
app.use("/", require("./routes/orderRoutes"));

app.use((req, res) => res.status(404).send("<h1>404 - Page Not Found</h1><a href='/'>Go home</a>"));

(async () => {
  await connectDB();
  await seedProducts();
  app.listen(PORT, () => console.log(`ShopEase MONOLITH running at http://localhost:${PORT}`));
})();
