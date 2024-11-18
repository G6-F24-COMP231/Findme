const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    try {
        const { serviceId, serviceSeekerId, serviceProviderId, selectedDays, dayTimes, subtotal, paymentInfo } = req.body;

        const newBooking = new Booking({
            serviceId,
            serviceSeekerId,
            serviceProviderId,
            selectedDays,
            dayTimes,
            subtotal,
            paymentInfo,
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};
