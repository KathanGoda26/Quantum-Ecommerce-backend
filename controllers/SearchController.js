import Product from '../models/Product.js';

export const search = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("Search API error:", err.message);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};