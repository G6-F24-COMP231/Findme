const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceName: { type: String },
  location: { type: String },
  resume: { type: String }, // Consider using Buffer if storing files directly
  availableDays: { type: [String] },
  startTime: { type: String },
  endTime: { type: String },
  price: { type: Number, min: 0 },
  languages: { type: [String] }
});

module.exports = mongoose.model('Service', serviceSchema);