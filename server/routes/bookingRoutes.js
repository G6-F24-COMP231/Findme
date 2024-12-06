// routes/bookingRoutes.js
const express = require('express');
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');

const router = express.Router();


/**
 * @description Create a new booking
 * @route POST /api/bookings/create
 * @access Public
 * @param {Object} req - The request object containing booking details
 * @param {Object} res - The response object to return the result
 * @param {Function} next - The next middleware to pass control if needed
 */
router.post('/create', createBooking);


/**
 * @description Get all bookings for a specific user
 * @route GET /api/bookings/user/:userId
 * @access Public
 * @param {Object} req - The request object containing the userId in params
 * @param {Object} res - The response object to return the user's bookings
 * @param {Function} next - The next middleware to pass control after logging
 */
router.get('/user/:userId', (req, res, next) => {
    console.log('GET /api/bookings/user/:userId accessed', req.params.userId);
    next();
}, getUserBookings);

/**
 * @description Cancel a specific booking
 * @route DELETE /api/bookings/:bookingId
 * @access Public
 * @param {Object} req - The request object containing the bookingId in params
 * @param {Object} res - The response object to return the result
 * @param {Function} next - The next middleware to pass control if needed
 */
router.delete('/:bookingId', cancelBooking);

module.exports = router;