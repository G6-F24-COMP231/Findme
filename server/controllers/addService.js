const User = require('../User');

exports.addService = async (req, res) => {
    try {
        const userId = req.params.id;
        const { serviceName, location, languages, price, availableDays, startTime, endTime } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const newService = {
            
            serviceName,
            location,
            languages,
            price,
            availableDays,
            startTime,
            endTime,
            
            
        };

        user.services.push(newService);


        await user.save();

        res.status(200).json({
            message: 'Service added successfully',
            user,
        });
        console.log('Service added successfully');
    } catch (error) {
        console.error('Error adding service: ', error);
        res.status(500).json({message: 'Server error'});
    } 
};