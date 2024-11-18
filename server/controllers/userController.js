const bcrypt = require('bcryptjs');
const User = require('../User');

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
        mobileNumber: user.mobileNumber,
        userType: user.userType,
        serviceType: user.serviceType,
        serviceName: user.serviceName,
        location: user.location,
        availableDays: user.availableDays,
        startTime: user.startTime,
        endTime: user.endTime,
        price: user.price,
        languages: user.languages,
        resume: user.resume
      }  
         });
  } catch (error) {
    console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}

