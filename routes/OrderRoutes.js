import express from 'express';
import { createOrder, getOrders, saveOrder, getUserOrders, updateOrderStatus } from '../controllers/OrderController.js';

const router = express.Router();

router.post('/create', createOrder);
router.post("/save", saveOrder); 
router.get('/all', getOrders);
router.get('/user/:userId', getUserOrders);
router.post("/:orderId/status", updateOrderStatus);

export default router;





