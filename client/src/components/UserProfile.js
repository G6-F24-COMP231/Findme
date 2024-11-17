import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import placeholderPic from "../images/ProfilePlaceHolder.svg";

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user || !user.id) {
          throw new Error('User not authenticated');
        }
        const response = await fetch(`http://localhost:5001/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.message);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async (editedData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedData = await response.json();
      setProfileData(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="user-profile">
      {isEditing ? (
        <EditForm profileData={profileData} onSave={handleSave} onCancel={() => setIsEditing(false)} />
      ) : (
        <ProfileDisplay profileData={profileData} onEdit={handleEdit} onLogout={handleLogout} />
      )}
    </div>
  );
};

const ProfileDisplay = ({ profileData, onEdit, onLogout }) => (
  <div className="profile-display">
    <div className="profile-header">
      <h2>User Profile</h2>
    </div>
    <div className="profile-content">
      <div className="profile-avatar">
      <img src={placeholderPic} alt="User Placeholder" />
      </div>
      <div className="profile-details">
        <h3>{profileData.username}</h3>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Mobile:</strong> {profileData.mobileNumber}</p>
        <p><strong>User Type:</strong> {profileData.userType}</p>
        {profileData.userType === 'ServiceProvider' && (
          <>
            <p><strong>Service Type:</strong> {profileData.serviceType}</p>
            <p><strong>Service Name:</strong> {profileData.serviceName}</p>
            <p><strong>Location:</strong> {profileData.location}</p>
            <p><strong>Available Days:</strong> {profileData.availableDays.join(', ')}</p>
            <p><strong>Hours:</strong> {profileData.startTime} - {profileData.endTime}</p>
            <p><strong>Price:</strong> ${profileData.price}/hour</p>
            <p><strong>Languages:</strong> {profileData.languages.join(', ')}</p>
            {profileData.resume && (
              <p><strong>Resume:</strong> <a href={profileData.resume} target="_blank" rel="noopener noreferrer">View Resume</a></p>
            )}
          </>
        )}
      </div>
    </div>
    <div className="profile-footer">
      <button className="edit-button" onClick={onEdit}>Edit</button>
      <button className="delete-button" onClick={onLogout} >Logout</button>
    </div>
  </div>
);

const EditForm = ({ profileData, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState(profileData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedData);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <h2>Edit Profile</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input id="username" name="username" value={editedData.username} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={editedData.email} onChange={handleChange} />
      </div>
      <div className="form-group">
        <label htmlFor="mobileNumber">Mobile Number</label>
        <input id="mobileNumber" name="mobileNumber" value={editedData.mobileNumber} onChange={handleChange} />
      </div>
      {editedData.userType === 'ServiceProvider' && (
        <>
          <div className="form-group">
            <label htmlFor="serviceType">Service Type</label>
            <input id="serviceType" name="serviceType" value={editedData.serviceType} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="serviceName">Service Name</label>
            <input id="serviceName" name="serviceName" value={editedData.serviceName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input id="location" name="location" value={editedData.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="availableDays">Available Days (comma-separated)</label>
            <input 
              id="availableDays" 
              name="availableDays" 
              value={editedData.availableDays.join(', ')} 
              onChange={(e) => handleChange({ target: { name: 'availableDays', value: e.target.value.split(', ') } })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input id="startTime" name="startTime" type="time" value={editedData.startTime} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input id="endTime" name="endTime" type="time" value={editedData.endTime} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (per hour)</label>
            <input id="price" name="price" type="number" value={editedData.price} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="languages">Languages (comma-separated)</label>
            <input 
              id="languages" 
              name="languages" 
              value={editedData.languages.join(', ')} 
              onChange={(e) => handleChange({ target: { name: 'languages', value: e.target.value.split(', ') } })}
            />
          </div>
        </>
      )}
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Save Changes</button>
      </div>
    </form>
  );
};

export default UserProfile;