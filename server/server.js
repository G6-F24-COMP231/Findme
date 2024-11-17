const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./User'); // Import the user model
const userRoutes = require('./routes/userRoutes');
const Service = require('./models/Service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://donotreplyfindme4:AP3F0rVogR7HMr7W@cluster0.4mcfz.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

// Use the userRoutes for all /api/users routes
app.use('/api/users', userRoutes);

// Use the userRoutes for all /api/services routes (consider creating separate serviceRoutes in the future)
app.use('/api/services', userRoutes);

// API endpoint to handle signup (consider moving this to userRoutes)
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, mobileNumber, userType, serviceType, serviceName, location, resume, availableDays, startTime, endTime, price, languages } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
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
      languages
    });

    await newUser.save();

    // Create and send token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'User signed up successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        userType: newUser.userType
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

// API endpoint to handle login (consider moving this to userRoutes)
app.post('/api/login', async (req, res) => {
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

    // Create and send token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/services/search', async (req, res) => {
  const query = req.query.q;
  try {
    const results = await Service.find({
      $or: [
        { serviceName: { $regex: query, $options: 'i' } }
      ]
    });
    console.log(results);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching search results' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});