const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { updateUser } = require('../controllers/updateUser');
const { searchServices } = require('../controllers/serviceController');
const { getUserProfile } = require('../controllers/getUserProfile');
const { addService } = require('../controllers/addService');

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.get('/search', searchServices);

router.get('/user/:id', getUserProfile);

router.put('/update/:id', updateUser);
//router.post('/add-service', addService);



router.post('/users/:id/services', addService);


module.exports = router;