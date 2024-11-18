const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../User'); // Import the user model
const userRoutes = require('../routes/userRoutes');
const Service = require('../models/Service');
const paymentRoutes = require('../routes/stripeRoutes')
const Stripe = require('stripe');
//const serviceRoutes = require('../routes/serviceRoutes');

require('dotenv').config();

const stripe = new Stripe('sk_test_51OCe4mKFcgoflAzwSpLvuZj43Iprt97iWvPtZIGErPrm5q1agYUl0a4q2MmNijnxBayf2qipVkRmIxThnIpVqjhB008IF2mYXk'); 

const app = express();
const PORT = process.env.PORT || 5001 || 5000;


app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://donotreplyfindme4:AP3F0rVogR7HMr7W@cluster0.4mcfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'/*'mongodb://localhost:27017/FindmeDB'*/, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.get("/config", (req, res) => {
  res.send({
    publishable: 'sk_test_51OCe4mKFcgoflAzwSpLvuZj43Iprt97iWvPtZIGErPrm5q1agYUl0a4q2MmNijnxBayf2qipVkRmIxThnIpVqjhB008IF2mYXk'
  })
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

app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency, // e.g., 'usd'
    });

  

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/add-service', async (req, res) => {
  try {
    const { serviceName, location, languages, availableDays, startTime, endTime, price } = req.body;
    const newService = new Service({ serviceName, location, languages, availableDays, startTime, endTime, price });

    await newService.save();
    res.status(201).json({ message: 'Service added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add service' });
  }
});

app.use('/api', userRoutes);
app.use('/api/services', userRoutes);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline'; object-src 'none';"
  );
  next();
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});