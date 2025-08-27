import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../models/Order.js";

dotenv.config();

(async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const orders = await Order.find({});
    let updated = 0;

    for (const order of orders) {
      const update = {};

      // Ensure customerId field exists
      if (order.customerId === undefined) {
        update.customerId = null;
      }

      // Normalize phone to string
      if (order.customer && typeof order.customer.phone !== "string") {
        update["customer.phone"] = String(order.customer.phone ?? "");
      }

      if (Object.keys(update).length) {
        await Order.updateOne({ _id: order._id }, { $set: update });
        updated++;
      }
    }

    console.log(`Migration complete. Updated ${updated} orders.`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
})();



