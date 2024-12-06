const express = require('express');
const { registerUser, loginUser, toggleFavorite, getFavorites } = require('../controllers/userController');
let userController = require('../controllers/userController');

const router = express.Router();


/**
 * @route POST /api/users/login
 * @desc User login
 * @access Public
 * @param {Object} req - The request object, containing login credentials like email and password in the body
 * @param {Object} res - The response object to send success or failure message
 * @param {Function} next - The next middleware function, if needed
 */
router.post('/login', loginUser);

/**
 * @route POST /api/users/signup
 * @desc User registration
 * @access Public
 * @param {Object} req - The request object, containing registration details like email, password, and username
 * @param {Object} res - The response object to send success or failure message
 * @param {Function} next - The next middleware function, if needed
 */
router.post('/signup', registerUser);

/**
 * @route GET /api/users/user/:id
 * @desc Get a user's profile information by user ID
 * @access Private (auth required)
 * @param {Object} req - The request object, containing userId in the URL parameter
 * @param {Object} res - The response object to send the user's profile information
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/user/:id', userController.getUserProfile);

/**
 * @route PUT /api/users/update/:id
 * @desc Update user details
 * @access Private (auth required)
 * @param {Object} req - The request object, containing updated user information in the body
 * @param {Object} res - The response object to send success or failure message
 * @param {Function} next - The next middleware function, if needed
 */
router.put('/update/:id', userController.updateUser);

/**
 * @route GET /api/users/:id
 * @desc Get a user by ID
 * @access Public
 * @param {Object} req - The request object, containing userId in the URL parameter
 * @param {Object} res - The response object to send the user data
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/:id', userController.getUser);


/**
 * @route POST /api/users/:userId/favorites/:serviceId/toggle
 * @desc Toggle a service as favorite for a specific user
 * @access Private (auth required)
 * @param {Object} req - The request object, containing userId and serviceId in the URL parameters
 * @param {Object} res - The response object to send the result of the operation
 * @param {Function} next - The next middleware function, if needed
 */
router.post('/:userId/favorites/:serviceId/toggle', toggleFavorite); // Handle adding/removiong services to favorites

/**
 * @route GET /api/users/:userId/favorites
 * @desc Get all favorite services for a specific user
 * @access Private (auth required)
 * @param {Object} req - The request object, containing userId in the URL parameter
 * @param {Object} res - The response object to send the list of favorite services
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/:userId/favorites', getFavorites); // Get all favorite services for a user


/**
 * @route GET /api/users/:userId/bookings
 * @desc Get all bookings for a specific user
 * @access Private (auth required)
 * @param {Object} req - The request object, containing userId in the URL parameter
 * @param {Object} res - The response object to send the list of bookings
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/:userId/bookings', userController.getUserBookings);

module.exports = router; 