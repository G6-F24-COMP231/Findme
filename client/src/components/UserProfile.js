import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import placeholderPic from "../images/ProfilePlaceHolder.svg";

import axios from "axios";

// Fetching User detail

// const initialUser = {
//   username: "johndoe",
//   email: "john@example.com",
//   mobileNumber: "+1234567890",
//   userType: "ServiceProvider",
//   serviceType: "Plumbing",
//   serviceName: "John's Plumbing Services",
//   location: "New York, NY",
//   resume: "john_doe_resume.pdf",
//   availableDays: ["Monday", "Wednesday", "Friday"],
//   startTime: "09:00",
//   endTime: "17:00",
//   price: 50,
//   languages: ["English", "Spanish"],
// };


// const UserProfile = () => {
//   const [user, setUser] = useState(initialUser);
//   const [isEditing, setIsEditing] = useState(false);

//   const handleEdit = () => setIsEditing(true);
//   const handleCancel = () => setIsEditing(false);
//   const handleSave = (editedUser) => {
//     setUser(editedUser);
//     setIsEditing(false);
//     //  send the updated user data to backend
//   };
//   const handleDelete = () => {
//     // Implement delete functionality here
//     console.log("Delete profile");
//     // send a delete request to backend
//   };

// Fetching User detail
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/user/${userId}');
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async (editedUser) => {
    try {
      const response = await axios.put('http://localhost:5001/api/update/${userId}', editedUser);
      setUser(response.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:5001/api/update/${userId}');
      alert("Profile deleted successfully!");
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Failed to delete profile.");
    }
  };

  if (!user) {
    return <div>Loading.....</div>
  }

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
      <button onClick={onEdit}>Edit</button>
    </div>
    <div className="profile-content">
      <div className="profile-avatar">
        <img src={placeholderPic} alt="User Placeholder" />
      </div>
      <div className="profile-details">
        <h3>{user.username}</h3>
        <p>{user.email}</p>
        <p><strong>📱 Mobile:</strong> {user.mobileNumber}</p>
        <p><strong>👤 User Type:</strong> {user.userType}</p>
        <p><strong>🌐 Service Type:</strong> {user.serviceType}</p>
        <p><strong>🌐 Service Name:</strong> {user.serviceName}</p>
        <p><strong>📍 Location:</strong> {user.location}</p>
        <p><strong>📅 Available Days:</strong> {user.availableDays.join(", ")}</p>
        <p><strong>🕒 Hours:</strong> {user.startTime} - {user.endTime}</p>
        <p><strong>💰 Price:</strong> ${user.price}/hour</p>
        <p><strong>Languages:</strong> {user.languages.join(", ")}</p>
      </div>
      <div className="profile-resume">
        <h4>Resume</h4>
        <a href={user.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
      </div>
    </div>
    <div className="profile-footer">
      <button onClick={onDelete} className="delete-button">Delete Profile</button>
    </div>
  </div>
);

const EditForm = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value.split(',').map(item => item.trim()) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <h2>Edit Profile</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input id="username" name="username" value={editedUser.username} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={editedUser.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="mobileNumber">Mobile Number</label>
        <input id="mobileNumber" name="mobileNumber" value={editedUser.mobileNumber} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="userType">User Type</label>
        <select name="userType" value={editedUser.userType} onChange={handleChange}>
          <option value="ServiceProvider">Service Provider</option>
          <option value="ServiceSeeker">Service Seeker</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="serviceType">Service Type</label>
        <input id="serviceType" name="serviceType" value={editedUser.serviceType} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="serviceName">Service Name</label>
        <input id="serviceName" name="serviceName" value={editedUser.serviceName} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input id="location" name="location" value={editedUser.location} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="availableDays">Available Days (comma-separated)</label>
        <input 
          id="availableDays" 
          name="availableDays" 
          value={editedUser.availableDays.join(', ')} 
          onChange={handleArrayChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="startTime">Start Time</label>
        <input id="startTime" name="startTime" type="time" value={editedUser.startTime} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="endTime">End Time</label>
        <input id="endTime" name="endTime" type="time" value={editedUser.endTime} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price (per hour)</label>
        <input id="price" name="price" type="number" value={editedUser.price} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="languages">Languages (comma-separated)</label>
        <input 
          id="languages" 
          name="languages" 
          value={editedUser.languages.join(', ')} 
          onChange={handleArrayChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="resume">Resume URL</label>
        <input id="resume" name="resume" value={editedUser.resume} onChange={handleChange} />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Save Changes</button>
      </div>
    </form>
  );
};

export default UserProfile;