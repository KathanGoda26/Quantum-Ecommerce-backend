import rateLimit from 'express-rate-limit';
import express from 'express';

const app = express();

app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 1000, // 15 seconds
  max: 100, // 100 requests per 15 seconds
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;