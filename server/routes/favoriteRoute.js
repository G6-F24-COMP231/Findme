const express = require('express');
const {getFavorite} = require('../controllers/favoriteController')

const router = express.Router();

/**
 * @description Get all favorites for a specific user
 * @route GET /api/favourites/:userId
 * @access Public
 * @param {Object} req - The request object containing the userId in params
 * @param {Object} res - The response object to return the user's favorite services
 * @param {Function} next - The next middleware to pass control if needed
 */

router.get('/favourites/:userId', getFavorite);