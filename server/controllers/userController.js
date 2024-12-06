const bcrypt = require('bcryptjs');
const User = require('../models/User');
const axios = require('axios');

/**
 * @desc    Register new user
 * @route   POST /api/users/signup
 * @access  Public
 * 
 * This endpoint registers a new user by accepting user details from the request body, 
 * validating the required fields, checking if the user already exists, hashing the password,
 * creating a new user document, and saving it to the database.
 */
exports.registerUser = async (req, res) => {
  try {
    // Destructure the request body
    const {
      username,
      email,
      password,
      mobileNumber,
      userType,
      serviceType,
      serviceName,
      location,
      resume,
      availableDays,
      startTime,
      endTime,
      price,
      languages,
    } = req.body;
    

    console.log('Request Body:', req.body); // Log the entire request body to see the incoming data

    // Validate required fields
    if (!username || !email || !password || !mobileNumber) {
      console.log('Validation failed. Missing required fields.');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    console.log('Checking if user already exists...');
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    console.log('User Exists:', userExists); // Log whether the user already exists or not

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hashed Password:', hashedPassword); // Log the hashed password (ensure it's not exposed in production)

    

    // Create new user
    console.log('Creating new user object...');
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobileNumber,
      userType,
      serviceType,
      serviceName,
      location,
      
      resume,  // Assuming file uploads are handled separately
      availableDays,
      startTime,
      endTime,
      price,
      languages,
    });

    console.log('New User Object:', newUser); // Log the user object to check if everything looks good

    // Save user to the database
    console.log('Saving new user to the database...');
    await newUser.save();
    console.log('User saved successfully!');

    // Respond with success
    res.status(201).json({
      _id: newUser._id,
      userType: newUser.userType,
      username: newUser.username,
      email: newUser.email,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Error occurred:', error); // Log the error to see what's failing
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 * 
 * This endpoint logs in a user by verifying the provided username and password.
 * If the credentials are valid, a success message and user details are returned.
 */
exports.loginUser = async (req, res) => {
  console.log("Start logging");
  const { username, password } = req.body;

  try {
    console.log('Login attempt:', username, password);
    // Find user by userName
    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Respond with success
    res.status(200).json({
      message: 'Login successful', user: {
        id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id
 * @access  Public
 * 
 * This endpoint retrieves the profile of a specific user by ID.
 * It modifies the resume field to include only a snippet of the data.
 */
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    console.log(user);

    if (!user) {
      return res.this.status(404).json({ message: 'User not found' });
    }

    // Convert the Mongoose document to a plain object
    const userProfile = user.toObject();

    // Modify the resume field to include only relevant details
    if (userProfile.resume && userProfile.resume.data && userProfile.resume.data.buffer) {
      // Use the buffer property directly
      const bufferData = Buffer.from(userProfile.resume.data.buffer);


      // Check if bufferData has content
      if (bufferData.length > 0) {
        // Add a snippet of the resume data
        const snippet = bufferData.slice(0, 50); // Slice the first 50 bytes
        userProfile.resume.snippet = snippet.toString('base64');
      } else {
        userProfile.resume.snippet = "";
      }

      // Remove the full binary data to prevent it from being sent
      delete userProfile.resume.data;
    }

    res.status(200).json(userProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}


/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Public
 * 
 * This endpoint retrieves the user by ID, including basic details like username,
 * mobile number, etc. Useful for getting specific user information.
 */
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    console.log(user);

    if (!user) {
      return res.this.status(404).json({ message: 'User not found' });
    }


    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * @desc    Update user details
 * @route   PUT /api/users/update/:id
 * @access  Public
 * 
 * This endpoint updates user details such as `username`, `mobileNumber`, and `languages`.
 * The details are updated and saved to the database.
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing.' });
    }

    const { username, mobileNumber, languages } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (username) user.username = username;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (languages) user.languages = languages;

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        username: user.username,
        mobileNumber: user.mobileNumber,
        languages: user.languages,
        userType: user.userType,
        location: user.location
      },
    });
  } catch (error) {
    console.error('Error updating user: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Get user's bookings
 * @route   GET /api/users/:userId/bookings
 * @access  Public
 * 
 * This endpoint fetches all bookings for a specific user by populating the `bookings` field
 * with service details.
 */
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('bookings.serviceId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




/**
 * @desc    Toggle a listing in user's favorites
 * @route   POST /api/users/:userId/favorites/:serviceId/toggle
 * @access  Public
 * 
 * This endpoint toggles a service in the user's favorites. If the service is already favorited, 
 * it is removed; otherwise, it is added.
 */
exports.toggleFavorite = async (req, res) => {
  try {
    

    const { userId, serviceId } = req.params;

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the service is already in the user's favorites
    const isFavorite = user.favorites.includes(serviceId);

    if (isFavorite) {
      // Remove the service from the user's favorites
      user.favorites.pull(serviceId);
      await user.save();
      res.status(200).json({
        success: true,
        message: 'Service removed from favorites',
        favorites: user.favorites,
      });
    } else {
      // Add the service to the user's favorites
      user.favorites.push(serviceId);
      await user.save();
      res.status(200).json({
        success: true,
        message: 'Service added to favorites',
        favorites: user.favorites,
      });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * @desc    Get user's favorites listings
 * @route   GET /api/users/:userId/favorites
 * @access  Public
 * 
 * This endpoint retrieves all services marked as favorites by the user.
 * It populates the `favorites` field to return detailed information about each service.
 */
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch the user and populate the favorites to get detailed info about each service
    const user = await User.findById(userId).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if there are any favorites
    if (!user.favorites || user.favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found' });
    }

    // Log populated favorites for debugging purposes
    console.log('Populated favorites:', user.favorites);

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





