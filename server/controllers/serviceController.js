const User = require('../models/User');

/**
 * @desc    Get search results based on the query
 * @route   GET /api/services/search
 * @access  Public
 * 
 * This endpoint retrieves services based on query parameters such as 
 * service name, maximum price, and available day.
 */
exports.searchServices = async (req, res) => {
  const { q, maxPrice, selectedDay} = req.query; // Extract query parameters from the URL
  const searchQuery = q ? String(q) : ''; // Default to an empty string if `q` is not provided

  try {
    console.log('Attempting to find users with services matching the criteria...');
    console.log(searchQuery);
    console.log(maxPrice);
    console.log(selectedDay);
    // Find users who have at least one service matching the criteria
    const users = await User.find({
      
      
        serviceName: { $regex: new RegExp(searchQuery, 'i') }, // Match serviceName with regex
        ...(maxPrice && { price: { $lte: Number(maxPrice) } }), // Match maxPrice if provided
        ...(selectedDay && { availableDays: { $in: [selectedDay] } })
      
      
    });
   
    // Debugging: Log users with matched services
    console.log('Users matching query:', JSON.stringify(users, null, 2));

    // Return the filtered services
    if (users.length === 0) {
      return res.status(404).json({ results: [] });
    }

    res.status(200).json({ results: users });
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Fetch all services from all users
 * @route   GET /api/services/listofservices
 * @access  Public
 * 
 * This endpoint returns all services from all users that have a non-empty 
 * `serviceName` field. It flattens and returns a list of services.
 */
exports.getAllServices = async (req, res) => {
  try {
    // Fetch all users who have services
    const users = await User.find({ 'serviceName': { $exists: true /*,$ne: []*/ } });

    if (!users.length) {
      return res.status(404).json({ message: 'No services available' });
    }

    // Flatten the services array from all users
    const allServices = users.flatMap(user => user);

    console.log("Log???", allServices); // Optional, for debugging

    res.status(200).json(allServices); // Return the list of services
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Add a service for a specific user
 * @route   POST /api/users/:id/services
 * @access  Public
 * 
 * This endpoint allows a user to add a new service. The service data is 
 * stored in the user's `services` array.
 */
exports.addService = async (req, res) => {
  try {
    const userId = req.params.id;
    const { serviceName, location, languages, price, availableDays, startTime, endTime } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get details for a specific service by ID
 * @route   GET /api/services/:serviceId
 * @access  Public
 * 
 * This endpoint retrieves the details of a service based on its ID.
 * The service is retrieved from the user's services array.
 */
exports.getServiceById = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const service = await User.findOne({ '_id': serviceId });
    console.log(service);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).json({ message: 'Error fetching service details', error });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    // Fetch all users who have services
    const users = await User.find({ 'serviceName': { $exists: true, $ne: '' } });

    if (!users.length) {
      return res.status(404).json({ message: 'No services available' });
    }

    // Flatten the services array from all users
    const allServices = users.flatMap(user => user);

    console.log(allServices); // Optional, for debugging

    res.status(200).json(allServices); // Return the list of services
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
