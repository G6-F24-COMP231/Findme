import React, { useState } from 'react';
import './UserProfile.css';
import placeholderPic from "../images/ProfilePlaceHolder.svg";

const initialUser = {
  username: "johndoe",
  email: "john@example.com",
  mobileNumber: "+1234567890",
  userType: "ServiceProvider",
  serviceType: "Plumbing",
  serviceName: "John's Plumbing Services",
  location: "New York, NY",
  resume: "john_doe_resume.pdf",
  availableDays: ["Monday", "Wednesday", "Friday"],
  startTime: "09:00",
  endTime: "17:00",
  price: 50,
  languages: ["English", "Spanish"],
};

const UserProfile = () => {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);
  const handleSave = (editedUser) => {
    setUser(editedUser);
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
      <button className="edit-button" onClick={onEdit}>Edit Profile</button>
      <button onClick={onDelete} className="delete-button">Delete Profile</button>
    </div>
    </div>
  
);

const EditForm = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState(user);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <h2>Edit Profile</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          className="input-field"
          value={editedUser.username}
          onChange={handleChange}
        />
      </div>
      {/* Other form fields */}
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Update</button>
      </div>
    </form>
  );
};

export default UserProfile;
