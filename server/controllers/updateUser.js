const bcrypt = require('bcryptjs');
const User = require('../User');

exports.updateUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user fields
      const fieldsToUpdate = ['username', 'email', 'mobileNumber', 'serviceType', 'serviceName', 'location', 'availableDays', 'startTime', 'endTime', 'price', 'languages'];
      fieldsToUpdate.forEach(field => {
        if (req.body[field] !== undefined) {
          user[field] = req.body[field];
        }
      });
  
      await user.save();
      res.json(user);
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      res.status(500).json({ message: 'Server error' });
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