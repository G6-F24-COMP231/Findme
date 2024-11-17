const bcrypt = require('bcryptjs');
const User = require('../User');
const jwt = require('jsonwebtoken');  

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
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

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check for user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};