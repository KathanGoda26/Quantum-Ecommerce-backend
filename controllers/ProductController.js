import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const { f_, sort, limit, c_ } = req.query;
    const query = {};

    if (c_ === "clothing") {
      query.isClothing = true;
    } else {
      if (f_ === "electronic") query.isElectronic = true;
      if (f_ === "similar") {
        // For similar products, we'll return random products
        // This can be enhanced later to return products from same category
      }
      if (sort === "new") query.isNew = true;
      if (sort === "bestseller") query.isBestSeller = true;
    }

    let productsQuery = Product.find(query);

    if (sort === "popular") {
      productsQuery = productsQuery.sort({ rating: -1 });
    } else if (f_ === "similar") {
      // For similar products, use random sorting
      productsQuery = productsQuery.sort({ createdAt: 1 }); // Simple ordering for variety
    }

    if (limit && !isNaN(limit)) {
      productsQuery = productsQuery.limit(parseInt(limit));
    }

    const products = await productsQuery.exec();
    
    // Transform image paths to correct URLs
    const transformedProducts = products.map(product => {
      const productObj = product.toObject();
      if (productObj.image) {
        // Convert relative paths to absolute URLs
        if (productObj.image.startsWith('./')) {
          productObj.image = productObj.image.replace('./', '/uploads/');
        } else if (productObj.image.startsWith('images/')) {
          productObj.image = `/uploads/${productObj.image.replace('images/', '')}`;
        } else if (!productObj.image.startsWith('/uploads/')) {
          productObj.image = `/uploads/${productObj.image}`;
        }
      }
      return productObj;
    });

    res.json(transformedProducts);
  } catch (error) {
    console.error("Failed to fetch products", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Transform image path to correct URL
    const productObj = product.toObject();
    if (productObj.image) {
      // Convert relative paths to absolute URLs
      if (productObj.image.startsWith('./')) {
        productObj.image = productObj.image.replace('./', '/uploads/');
      } else if (productObj.image.startsWith('images/')) {
        productObj.image = `/uploads/${productObj.image.replace('images/', '')}`;
      } else if (!productObj.image.startsWith('/uploads/')) {
        productObj.image = `/uploads/${productObj.image}`;
      }
    }

    res.json(productObj);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
