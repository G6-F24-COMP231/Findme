require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../User'); // Import the user model
const userRoutes = require('../routes/userRoutes');
const Service = require('../models/Service');
//const serviceRoutes = require('../routes/serviceRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001 || 5000;


app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://donotreplyfindme4:AP3F0rVogR7HMr7W@cluster0.4mcfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'/*'mongodb://localhost:27017/FindmeDB'*/, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use('/api', userRoutes);
app.use('/api/services', userRoutes);

// API endpoint to handle signup
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, mobileNumber, userType, serviceType, serviceName, location, resume, availableDays, startTime, endTime, price, languages } = req.body;
    const newUser = new User({ username, email, password, mobileNumber, userType, serviceType, serviceName, location, resume, availableDays, startTime, endTime, price, languages });

    await newUser.save();
    res.status(201).json({ message: 'User signed up successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sign up' });
  }
});

app.get('/api/services/search', async (req, res) => {
  const query = req.query.q;
  try {
    const results = await Service.find({
      $or: [
        { serviceName: { $regex: query, $options: 'i' } }/*,
        { location: { $regex: query, $options: 'i' } }*/
      ]
    });
    console.log(results);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching search results' });
  }
});

app.use('/api', userRoutes);
app.use('/api/services', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});