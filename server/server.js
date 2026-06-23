const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const products = JSON.parse(fs.readFileSync(path.join(__dirname, "products.json"), "utf-8"));

app.use(cors());
app.use(express.json());

// GET all products
app.get("/api/products", (req, res) => {
  const { category, sale, featured } = req.query;
  let result = [...products];
  if (category && category !== "all") result = result.filter(p => p.category === category);
  if (sale === "true") result = result.filter(p => p.onSale);
  if (featured === "true") result = result.filter(p => p.featured);
  res.json(result);
});

// GET single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Not found" });
  res.json(product);
});

// POST order (stub)
app.post("/api/order", (req, res) => {
  const { items, total } = req.body;
  console.log("Order received:", { items, total });
  res.json({ success: true, orderId: `KF-${Date.now()}` });
});

app.listen(PORT, () => console.log(`KICKFORGE API running on :${PORT}`));
