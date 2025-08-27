import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, comment } = req.body;
    const { id: productId } = req.params;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required." });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product." });
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      comment,
    });
    await review.save();

    const allReviews = await Review.find({ product: productId });
    const averageRating =
      allReviews.reduce((acc, rev) => acc + rev.rating, 0) / allReviews.length;

    product.rating = averageRating;
    await product.save();

    res.status(201).json({ message: "Review added successfully." });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Server error while adding review." });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).populate(
      "user",
      "name"
    );
    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Server error while fetching reviews." });
  }
};

export const allReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Server error while fetching reviews." });
  }
};
