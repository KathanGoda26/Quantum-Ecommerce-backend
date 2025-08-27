import Order from "../models/Order.js";
import Product from "../models/Product.js";
import razorpay from "../utils/razorpay.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import { emitOrderStatus } from "../utils/tracking.js";

export const createOrder = async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const response = await razorpay.orders.create(options);
    res.status(200).json({ orderId: response.id, amount: response.amount });
  } catch (error) {                           
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ error: "Razorpay Error", details: error });
  }
};

export const saveOrder = async (req, res) => {
  try {
    const { orderItems, customer, billingAddress, shippingAddress, payment, customerId } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "Order items are required" });
    }
    if (!payment || !payment.status || !payment.orderId || !payment.paymentId) {
      return res.status(400).json({ success: false, message: "Payment details are incomplete" });
    }

    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ success: false, message: "Customer details are required" });
    }
    if (!billingAddress || !billingAddress.address || !billingAddress.city || !billingAddress.state || !billingAddress.pincode) {
      return res.status(400).json({ success: false, message: "Billing address is incomplete" });
    }
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: "Shipping address is incomplete" });
    }

    let resolvedCustomerId = customerId || null;
    if (resolvedCustomerId && !mongoose.Types.ObjectId.isValid(resolvedCustomerId)) {
      return res.status(400).json({ success: false, message: "Invalid customerId" });
    }
    if (!resolvedCustomerId) {
      const user = await User.findOne({ email: customer.email });
      if (user) {
        resolvedCustomerId = user._id;
      }
    }

    for (const item of orderItems) {
      if (!item?.productId) {
        return res.status(400).json({ success: false, message: "Each order item must include productId" });
      }
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({ success: false, message: `Invalid product ID format: ${item.productId}` });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }

      const currentStock = typeof product.stock === 'number' ? product.stock : 0;
      if (!Number.isFinite(currentStock) || currentStock <= 0) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
      if (currentStock < item.quantity) {
        return res.status(400).json({ success: false, message: `Only ${currentStock} left for ${product.name}` });
      }

      product.stock = currentStock - item.quantity;
      await product.save();
    }

    const newOrder = new Order({ status: 'completed', ...req.body, customerId: resolvedCustomerId });
    await newOrder.save();

    res.status(201).json({ success: true, message: "Order saved and stock updated." });
  } catch (error) {
    console.error("Order save error:", error, req.body);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save order.", 
      details: error?.message || null,
      stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Error fetching orders", details: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  emitOrderStatus(orderId, status); 
  res.json({ success: true, order });
};
