const express = require('express');
const router = express.Router();
const Review = require('../models/Review');


/**
 * @route POST /api/reviews
 * @desc Save a review
 * @access Public
 * @param {Object} req - The request object, containing title, review, rating, and userId
 * @param {Object} res - The response object to send success or failure message
 * @param {Function} next - The next middleware function, if needed
 */
router.post('/', async (req, res) => {
  try {
    const { title, review, rating, userId } = req.body;

    const newReview = new Review({
      title,
      review,
      rating,
      userId,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review saved successfully' });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ message: 'Failed to save review' });
  }
});


/**
 * @route GET /api/reviews/find/:userId
 * @desc Get all reviews for a specific user
 * @access Public
 * @param {Object} req - The request object, containing userId in the URL parameters
 * @param {Object} res - The response object to send the reviews or error message
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/find/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const reviews = await Review.find({ userId });
    console.log(reviews);
    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this user." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

/**
 * @route GET /api/reviews/:serviceId
 * @desc Get all reviews for a specific service
 * @access Public
 * @param {Object} req - The request object, containing serviceId in the URL parameters
 * @param {Object} res - The response object to send the reviews or error message
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;  // Get serviceId from the URL parameter
    const userId = serviceId;
    const reviews = await Review.find({ userId });  // Filter reviews by serviceId
    
    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this service." });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

module.exports = router;
