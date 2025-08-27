import express from "express";
import {
  register,
  login,
  sendOtp,
} from "../controllers/AuthController.js";
import { verifyOtp } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

export default router;



