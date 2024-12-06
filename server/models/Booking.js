// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: [
    {
      day: { type: String, required: true }, // e.g., "Monday", "Tuesday"
      startTime: { type: String, required: true }, // e.g., "09:00"
      endTime: { type: String, required: true }, // e.g., "17:00"
    },
  ],
  paymentInfo: {
    amount: { type: Number, required: false },
    paymentMethod: { type: String, required: false },
    paymentStatus: {
      type: String,
      enum: ['Not Paid', 'Paid', 'Pending'],
      default: 'Paid',
    },
  },
  amount: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);