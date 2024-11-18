import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import placeholderPic from "../images/ProfilePlaceHolder.svg";
import { useContext } from 'react';
import { UserContext } from './../UserContext';
import axios from 'axios';


const UserProfile = () => {
  //const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useContext(UserContext);
  console.log(user);
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSave = (editedUser) => {
    //setUser(editedUser);
    setIsEditing(false);
    // Send the updated user data to the backend
  };
  const handleDelete = () => {
    console.log("Delete profile");
    // Send a delete request to the backend
  };

  return (
    <div className="user-profile">
      {isEditing ? (
        <EditForm user={user} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <ProfileDisplay user={user} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

const ProfileDisplay = ({ user, onEdit, onDelete }) => (
  <div className="profile-display">
    <div className="profile-header">
      <h2>User Profile</h2>
    </div>
    <div className="profile-content">
      <div className="profile-avatar">
        <img src={placeholderPic} alt="User Placeholder" />
      </div>
      <div className="profile-details">
        <h3>{user?.username}</h3>
        <p>{user?.email}</p>
        <p><strong>📱 Mobile:</strong> {user?.mobileNumber}</p>
        <p><strong>👤 User Type:</strong> {user?.userType}</p>
        <p><strong>🌐 Service Type:</strong> {user?.serviceType}</p>
        <p><strong>🌐 Service Name:</strong> {user?.serviceName}</p>
        <p><strong>📍 Location:</strong> {user?.location}</p>
        <p><strong>📅 Available Days:</strong> {user?.availableDays?.map(days => days).join(', ')}</p>
        <p><strong>🕒 Hours:</strong> {user?.startTime} - {user?.endTime}</p>
        <p><strong>💰 Price:</strong> ${user?.price}/hour</p>
        <p><strong>Languages:</strong> {user?.languages?.map(lang => lang).join(', ')}</p>
      </div>  
      <div className="profile-resume">
        <h4>Resume</h4>
        <a href={user?.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
      </div>
    </div>

    <div className='profile-services'>
      <h3>Services Offered</h3>
        {user ? (
          <>
            <h5>{user.serviceName}</h5>
            <p>{user.location}</p>
            <p>{user.languages?.join(", ")}</p>
            <p>Price: ${user.price}/hour</p>
            <p>Available Days: {user.availableDays?.join(", ")}</p>
            <p>Hours: {user.startTime} - {user.endTime}</p>
          </>
        ) : (
          <p>No service available</p>
        )}
    </div>
    
    <div className="profile-footer">
      <button className="edit-button" onClick={onEdit}>Edit Profile</button>
      <button onClick={onDelete} className="delete-button">Delete Profile</button>
    </div>
    </div>
  
);

const EditForm = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState(user);
    const { setUser } = useContext(UserContext);

  useEffect(() => {
  console.log('Edited User:', editedUser);
}, [editedUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    //onSave(editedUser);

    if (!editedUser.id) {
      alert('User ID is missing. Unable to update profile.');
       return;
    }

    console.log(editedUser);

    try {
      const response = await axios.put(`http://localhost:5001/api/update/${editedUser.id}`, editedUser);
      console.log('Profile updated successfully:', response.data);


      setUser(response.data.user);
      onSave(response.data.user);

      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile", error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <h2>Edit Profiles</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          className="input-field"
          value={editedUser?.username}
          onChange={handleChange}
        />
      </div>

      {/* Email */}
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        className="input-field"
        value={editedUser?.email}
        onChange={handleChange}
      />
      </div>
      
      {/* Mobile Number */}
    <div className="form-group">
      <label htmlFor="mobileNumber">Mobile Number</label>
      <input
        id="mobileNumber"
        name="mobileNumber"
        type="text"
        className="input-field"
        value={editedUser?.mobileNumber}
        onChange={handleChange}
      />
    </div>

    {/* User Type */}
    <div className="form-group">
      <label htmlFor="userType">User Type</label>
      <select
        id="userType"
        name="userType"
        className="input-field"
        value={editedUser?.userType}
        onChange={handleChange}
      >
        <option value="ServiceProvider">Service Provider</option>
        <option value="Client">Client</option>
      </select>
    </div>

    {/* Service Type */}
    <div className="form-group">
      <label htmlFor="serviceType">Service Type</label>
      <input
        id="serviceType"
        name="serviceType"
        className="input-field"
        value={editedUser?.serviceType}
        onChange={handleChange}
      />
    </div>

    {/* Service Name */}
    <div className="form-group">
      <label htmlFor="serviceName">Service Name</label>
      <input
        id="serviceName"
        name="serviceName"
        className="input-field"
        value={editedUser?.serviceName}
        onChange={handleChange}
      />
    </div>

    {/* Location */}
    <div className="form-group">
      <label htmlFor="location">Location</label>
      <input
        id="location"
        name="location"
        className="input-field"
        value={editedUser?.location}
        onChange={handleChange}
      />
    </div>

    {/* Available Days */}
    <div className="form-group">
      <label htmlFor="availableDays">Available Days</label>
      <input
        id="availableDays"
        name="availableDays"
        className="input-field"
        placeholder="e.g., Monday, Tuesday"
        value={editedUser?.availableDays?.join(', ') || ''} // Assuming `availableDays` is an array
        onChange={handleChange}
      />
    </div>

    {/* Start Time */}
    <div className="form-group">
      <label htmlFor="startTime">Start Time</label>
      <input
        id="startTime"
        name="startTime"
        type="time"
        className="input-field"
        value={editedUser?.startTime}
        onChange={handleChange}
      />
    </div>

    {/* End Time */}
    <div className="form-group">
      <label htmlFor="endTime">End Time</label>
      <input
        id="endTime"
        name="endTime"
        type="time"
        className="input-field"
        value={editedUser?.endTime}
        onChange={handleChange}
      />
    </div>

    {/* Price */}
    <div className="form-group">
      <label htmlFor="price">Price</label>
      <input
        id="price"
        name="price"
        type="number"
        className="input-field"
        value={editedUser?.price}
        onChange={handleChange}
      />
    </div>

    {/* Languages */}
    <div className="form-group">
      <label htmlFor="languages">Languages</label>
      <input
        id="languages"
        name="languages"
        className="input-field"
        placeholder="e.g., English, Spanish"
        value={editedUser?.languages?.join(', ') || ''} // Assuming `languages` is an array
        onChange={handleChange}
      />
    </div>

    {/* Resume */}
    {/* <div className="form-group">
      <label htmlFor="resume">Resume</label>
      <input
        id="resume"
        name="resume"
        type="file"
        className="input-field"
        onChange={(e) => handleFileChange(e)} // Assuming a handler for file uploads
      />
    </div> */}

    
      
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Update</button>
      </div>
    
  </form>
      
     
    
  );
};

export default UserProfile;
