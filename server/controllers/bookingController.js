// controllers/bookingController.js
const Booking = require('../models/Booking');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Creates a new booking for a user with a specified service provider.
 * @param {Object} req - The request object containing booking details.
 * @param {Object} res - The response object to send back the result of the operation.
 */
exports.createBooking = async (req, res) => {
  try {
    const { userId, serviceProviderId, serviceName, date, timeSlot, paymentInfo, amount, location } = req.body;

     // Validate if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const serviceProvider = await User.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    const newBooking = new Booking({
      user: userId,
      serviceProvider: serviceProviderId,
      serviceName: serviceName,
      date,
      timeSlot: Object.keys(timeSlot).map((day) => ({
        day,
        startTime: timeSlot[day].startTime,
        endTime: timeSlot[day].endTime,
      })),
      paymentInfo,
      amount: amount,
      location: location
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * Fetches all bookings made by a specific user.
 * @param {Object} req - The request object containing the user ID as a parameter.
 * @param {Object} res - The response object to send back the list of bookings.
 */
exports.getUserBookings = async (req, res) => {
  try {
    
    const { userId } = req.params;
    console.log('Fetching bookings for user ID:', userId);

    

        // Convert userId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ message: 'Invalid user ID format' });
        }

    

     // Create a new ObjectId instance
     const objectId = new mongoose.Types.ObjectId(userId);


    const bookings = await Booking.find({ user: objectId });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


/**
 * Cancels a specific booking based on the booking ID.
 * @param {Object} req - The request object containing the booking ID to be canceled.
 * @param {Object} res - The response object to send back the result of the cancellation.
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};