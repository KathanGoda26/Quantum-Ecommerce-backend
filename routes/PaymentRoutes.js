import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/PaymentController.js';

const router = express.Router();

router.post('/razorpay-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);

export default router;
