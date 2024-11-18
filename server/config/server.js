const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../User'); // Import the user model
const userRoutes = require('../routes/userRoutes');
const Service = require('../models/Service');
const bookingRoutes = require('../routes/bookingRoutes');

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

app.post('/api/users/:id/services', async (req, res) => {
  try {
    const userId = req.params.id;
    const { serviceName, location, languages, price, availableDays, startTime, endTime } = req.body;
    //const newService = new User.services({ serviceName, location, languages, price, availableDays, startTime, endTime });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newService = { serviceName, location, languages, price, availableDays, startTime, endTime };
    user.services.push(newService);

    await user.save();


    res.status(201).json({ message: 'Service added successfully', user });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ error: 'Failed to add service' });
  }
});

app.get('/api/services/:serviceId', async (req, res) => {
  const { serviceId } = req.params;
  try {
    const service = await User.findById(serviceId); // Replace with your database query
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service details', error });
  }
});


app.use('/api', userRoutes);
app.use('/api/services', userRoutes);
app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});