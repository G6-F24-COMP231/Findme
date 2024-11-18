const bcrypt = require('bcryptjs');
const User = require('../User');

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        Object.keys(updates).forEach((key) => {
        // if (key === 'password') {
        //     return; // Skip password for now, handle it separately
        // }
        user[key] = updates[key];
        });

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: {
               _id: user._id,
                username: user.username,
                email: user.email,
                mobileNumber: user.mobileNumber,
                userType: user.userType,
                serviceType: user.serviceType,
                serviceName: user.serviceName,
                location: user.location,
                availableDays: user.availableDays,
                startTime: user.startTime,
                endTime: user.endTime,
                price: user.price,
                languages: user.languages,
            },
        });
    } catch (error) {
        console.error('Error updating user: ', error);
        res.status(500).json({message: 'Server error'});
    } 
};


// Connecting to the update form

// import axios from 'axios';
// import { useState } from 'react';

// const UpdateUser = ({ userId }) => {
//     const [formData, setFormData] = useState({
//         username: '',
//         password: '',
//         mobileNumber: '',
//         languages: [],
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value});
//     };

//     const updateUser = async () => {
//         try {
//             const response = await axios.put('http://localhost:5001/api/update/${userId}', formData);
//             console.log('User updated successfully:', response.data);
//         } catch (error) {
//             console.error('Error updating user:', error);
//         }
//     };

//     return(
//         <div>
//             <h2>Update User</h2>
//             <form onSubmit={(e) => { e.preventDefault(); updateUser(); }}>
//             <input
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 value={formData.username}
//                 onChange={handleInputChange}
//             />
//             <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//             />
//             <input
//                 type="text"
//                 name="mobileNumber"
//                 placeholder="Mobile Number"
//                 value={formData.mobileNumber}
//                 onChange={handleInputChange}
//             />
//             <input
//                 type="text"
//                 name="languages"
//                 placeholder="Languages (comma-separated)"
//                 value={formData.languages.join(', ')}
//                 onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(', ') })}
//             />
//             <button type="submit">Update User</button>
//         </form>
//         </div>
//     );
// };

// export default UpdateUser;