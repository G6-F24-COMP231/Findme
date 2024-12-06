const express = require('express');
const {
    searchServices,
    getAllServices,
    addService,
    getServiceById,
} = require('../controllers/serviceController');
const router = express.Router();

/**
 * @route GET /api/services/search
 * @desc Search for services by name or location
 * @access Public
 * @param {Object} req - The request object, containing search query parameters like 'name' and 'location'
 * @param {Object} res - The response object to send the results or error message
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/search', searchServices);

/**
 * @route GET /api/services/listofservices
 * @desc Get all services from all users
 * @access Public
 * @param {Object} req - The request object
 * @param {Object} res - The response object to send the services or error message
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/listofservices', getAllServices);

/**
 * @route POST /api/services/users/:id/services
 * @desc Add a service to a user by userId
 * @access Private (auth required)
 * @param {Object} req - The request object, containing the userId as a URL parameter and service data in the body
 * @param {Object} res - The response object to send success or failure message
 * @param {Function} next - The next middleware function, if needed
 */
router.post('/users/:id/services', addService);

/**
 * @route GET /api/services/:serviceId
 * @desc Get details of a specific service by serviceId
 * @access Public
 * @param {Object} req - The request object, containing serviceId in the URL
 * @param {Object} res - The response object to send the service details or error message
 * @param {Function} next - The next middleware function, if needed
 */
router.get('/:serviceId', getServiceById);

module.exports = router;
