const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51OCe4mKFcgoflAzwSpLvuZj43Iprt97iWvPtZIGErPrm5q1agYUl0a4q2MmNijnxBayf2qipVkRmIxThnIpVqjhB008IF2mYXk');

router.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body; // Pass amount and currency from the frontend

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency, // e.g., 'usd'
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret, // Send the client secret to the frontend
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
