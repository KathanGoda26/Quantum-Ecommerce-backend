import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      brand,
      stock,
      description,
      rating,
      isFeatured,
      isBestSeller,
      isNew,
      isClothing,
    } = req.body;

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      name,
      price,
      category,
      brand,
      stock,
      description,
      rating: parseFloat(rating),
      isFeatured: isFeatured === "true" || isFeatured === true,
      isBestSeller: isBestSeller === "true" || isBestSeller === true,
      isNew: isNew === "true" || isNew === true,
      isClothing: isClothing === "true" || isClothing === true,
      image: imagePath,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      price,
      brand,
      image,
      stock,
      category,
      description,
      isFeatured,
      isBestSeller,
      isNew,
      isClothing,
      rating,
    } = req.body;

    product.name = name;
    product.price = price;
    product.brand = brand;
    product.image = image;
    product.stock = stock;
    product.category = category;
    product.description = description;
    product.rating = rating;
    product.isFeatured = isFeatured === "true";
    product.isBestSeller = isBestSeller === "true";
    product.isNew = isNew === "true";
    product.isClothing = isClothing === "true";

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Server error during product update" });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};
