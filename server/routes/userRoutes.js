const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerUser } = require('../controllers/userController');
const { updateUser } = require('../controllers/updateUser');
const { searchServices } = require('../controllers/serviceController');
const User = require("../User");

const authenticate = require("../middleware/auth");

const router = express.Router();

router.post('/signup', registerUser);
router.get('/search', searchServices);

// Add more routes here as needed

// Route to update the db with info updated by user in profile
router.put('/update/:id', updateUser);


// for authentication if we need in the future

router.get("/profile", authenticate, async (req, res) => {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    res.json(user);
});
// For login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({message: "Invalid credentials"});

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });

        res.json({
            token, 
            user: {
                username: user.username,
                email: user.email,
                userType: user.userType,
                serviceType: user.serviceType,
                serviceName: user.serviceName,
                location: user.location,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;