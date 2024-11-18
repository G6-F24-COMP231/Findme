const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    serviceSeekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    serviceProviderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    selectedDays: {
        type: [String],
        required: true,
    },
    dayTimes: {
        type: Map,
        of: {
            startTime: String,
            endTime: String,
        },
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    paymentInfo: {
        cardNumber: String,
        expiryDate: String,
        cvv: String,
    },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
