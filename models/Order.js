import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'PAID', 'CANCELLED'],
    default: 'COMPLETED'
  },
  customer: {
    name: String,
    email: String,
    phone: String
  },
  billingAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    gstin: String,
  },
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    deliveryNote: String,
  },
  orderItems: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  payment: {
    status: String,
    method: String,
    orderId: String,
    paymentId: String,
  },
  totalAmount: Number,
  tax: Number,
  discount: Number,
  finalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Order", orderSchema);
