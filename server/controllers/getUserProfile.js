const User = require('../User');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated request

        const user = await User.findById(userId).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error in getUserProfile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};