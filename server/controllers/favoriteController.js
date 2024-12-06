const Favorite = require('../models/Favorite')

const mongoose = require('mongoose');

/**
 * Fetches the list of favorite services for a given user.
 * @param {Object} req - The request object, containing the user ID in the URL params.
 * @param {Object} res - The response object, used to send the result or error back to the client.
 */
exports.getFavorite = async (req, res) => {
	const { userId } = req.params;

	try {
		// Convert userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID format' });
        }

    	// Query the database for favorites
    	const favorites = await Favorite.find({ userId }).populate("serviceId");
		
		// Return the favorites
    	res.status(200).json(favorites);	
		
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}