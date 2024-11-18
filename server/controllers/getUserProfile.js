const User = require('../User');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        console.log(user);

        if (!user) {
            return res.this.status(404).json({message: 'User not found'});
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
}