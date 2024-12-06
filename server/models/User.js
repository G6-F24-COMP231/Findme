const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  serviceName: String,
  location: String,
  languages: [String],
  price: { type: Number, min: 0 },
  
  availableDays: [String],
  startTime: String,
  endTime: String,
});

// Booking Schema (Embedded in User)
const BookingSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceName: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  paymentInfo: {
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['Not Paid', 'Paid', 'Pending'],
      default: 'Paid',
    },
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username..'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please add a mobile number'],
  },
  userType: {
    type: String,
    enum: ['ServiceProvider', 'ServiceSeeker'], // Example values, adjust as needed
  },
  serviceType: {
    type: String,
  },
  serviceName: {
    type: String,
  },
  location: {
    type: String,
  },
  latitude: { type: Number, required: false },
  longitude: { type: Number, required: false },

  resume: {
    data: Buffer, // Use Buffer to store the actual file content
    contentType: String, // Metadata to indicate file type
    filename: String // Store the file name
  },
  availableDays: {
    type: [String],
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  price: {
    type: Number,
    min: 0,
  },
  languages: {
    type: [String],
  },
  services: [ServiceSchema ], 
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model('User', userSchema);
