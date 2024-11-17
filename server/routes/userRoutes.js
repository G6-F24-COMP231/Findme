const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { updateUser } = require('../controllers/updateUser');
const { searchServices } = require('../controllers/serviceController');
const { getUserProfile } = require('../controllers/getUserProfile');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/search', searchServices);
router.get('/user/:id', getUserProfile);
router.put('/update/:id', updateUser);

// Get user profile
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile
router.put('/profile', authMiddleware, updateUser);

module.exports = router;