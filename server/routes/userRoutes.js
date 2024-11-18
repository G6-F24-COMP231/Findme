const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { updateUser } = require('../controllers/updateUser');
const { searchServices } = require('../controllers/serviceController');
const { getUserProfile } = require('../controllers/getUserProfile');

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.get('/search', searchServices);

router.get('/user/:id', getUserProfile);

// Add more routes here as needed
router.put('/update/:id', updateUser);
//router.post('/add-service', addService);

module.exports = router;