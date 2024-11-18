const express = require('express');
const { createBooking } = require('../controllers/bookingController');
const router = express.Router();

router.post('/create-booking', createBooking);

module.exports = router;
