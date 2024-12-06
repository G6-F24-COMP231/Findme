import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserProfile.css';
import placeholderPic from "../images/ProfilePlaceHolder.svg";
import { useContext } from 'react';
import { UserContext } from './../UserContext';
import axios from 'axios';
import ServiceCard from './ServiceCard';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft} from "@fortawesome/free-solid-svg-icons"

/**
 * UserProfile component fetches and displays user profile data.
 * It supports editing, saving, and deleting user profiles.
 */
const UserProfile = () => {
  // State variables to manage user data, editing status, reviews, resume, and favorites
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const[resume, setResume] = useState([]);
  const[favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const { user: contextUser } = useContext(UserContext);
  console.log(user);


  /**
   * Fetches user, reviews, resume, and favorites from the server using Axios.
   * This effect runs whenever the contextUser changes (i.e., user login).
   */
  useEffect(() => {
    // Fetch user data from backend
    const fetchUser = async () => {
      try {
        const userId = contextUser?.id;
        if (!userId) {
          console.error("User ID not found in context.");
          return;
        }
        const response = await axios.get(`https://findme-1-77d9.onrender.com/api/users/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile: ", error);
      }
    };

    // Fetch reviews for the current user
    const fetchReviews = async () => {
      try {
        const userId = contextUser?.id;
        if(!userId) {
          console.error("User ID not found in context.");
          return;
        }
        console.log(userId);
        const response = await axios.get(`https://findme-1-77d9.onrender.com/api/reviews/find/${userId}`);
        setReviews(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };

    const fetchResume = async () => {
      try {
        const userId = contextUser?.id;
        if(!userId) {
          console.error("User ID not found in context.");
          return;
        }
        const response = await axios.get(`https://findme-1-77d9.onrender.com/api/users/${userId}/resume`);
        setResume(response.data);
      } catch (error) {
        console.error("Error fetching resume: ", error);
      }
    };

    // Fetch user's favorite services
    const fetchFavorites = async () => {
      try {
        const userId = contextUser?.id;
        if (!userId) {
          console.error("User Id not found in context.");
          return;
        }
        const response = await axios.get(`https://findme-1-77d9.onrender.com/api/users/${userId}/favorites`);
        setFavorites(response.data.favorites);
        console.log(response);
        
      } catch (error) {
        console.error("Error fetching favorites: ", error);
      }
    };

    // Fetch all data if contextUser exists
    if (contextUser?.id) {  
      fetchUser();
      fetchReviews();
      fetchResume();
      fetchFavorites();
    }
    
  }, [contextUser]);

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
      {/* Navigation button to go back to the home page */}
      <div className="back-icon" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
      </div>

      {/* Render edit form if user is in editing mode, else show profile display */}
      {isEditing ? (
        <EditForm user={user} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <ProfileDisplay 
          user={user} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
          reviews={reviews}
          resume={resume}
          favorites={favorites}

        />
      )}
    </div>
  );
  
};


/**
 * ProfileDisplay component is responsible for rendering the user's profile information.
 * It also displays reviews, services, resume, and favorites.
 */
const ProfileDisplay = ({ user, onEdit, onDelete, reviews, resume, favorites, onFavoriteToggle }) => (
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

      {/* Resume section */}
      <div className="profile-resume">
        <h4>Resume</h4>
        {resume ? (
          <a href={resume} target="_blank" rel="noopener noreferrer">View Resume</a>
        ) : (
          <p>No resume uploaded</p>
        )}
      </div>
      
      {/* Services Offered */}
      <div className='profile-services'>
        <h3>Services Offered</h3>
        
        {user?.serviceName && user?.location && user?.languages && user?.price ? (
            <ServiceCard
              id={user._id}
              title={user.serviceName}
              location={user.location}
              languages={user.languages}
              pricePerHour={user.price}
            />
          ) : (
              <p>No service available</p>
          )}

        {user?.services && user?.services?.length > 0 ? (
            user.services.map((service) => (
              <ServiceCard 
                id={service._id}
                title={service.serviceName}
                location={service.location}
                languages={service.languages}
                pricePerHour={service.price}
              />
            ))
          ) : (
            <p></p>
          )}
      </div>

      {/* Favorite services */}
      <div className='profile-favorites'>
          <h3>Favorite Services</h3>
          {favorites?.length > 0 ? (
            favorites.map((item
            ) => (
              <div key={item._id} className='favorite-service'>
                <ServiceCard
                  id={item._id}
                  title={item.serviceName}
                  location={item.location}
                  languages={item.languages}
                  pricePerHour={item.price}
                />
              </div>
            ))
          ) : (
            <p>No favorites yet.</p>
          )}
      </div>

      {/* Reviews */}
      <div className='profile-reviews'>
        <h3>Reviews</h3>
        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <h5>{review.title}</h5>
              <p>{review.review}</p>
              <p><strong>Rating:</strong> {review.rating} ⭐</p>
              <p><em>{new Date(review.createdAt).toLocaleDateString()}</em></p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

    </div>
    
    <div className="profile-footer">
      <button className="edit-button" onClick={onEdit}>Edit Profile</button>
      <button onClick={onDelete} className="delete-button">Delete Profile</button>
    </div>
    </div>
  
);


/**
 * EditForm component handles the editing of user profile.
 * It allows the user to update their profile information, including uploading and deleting a resume.
 */
const EditForm = ({ user, onSave, onCancel }) => {
  const [editedUser, setEditedUser] = useState(user);
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(!!editedUser?.resume);
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

  const handleResumeUpload = () => {
    const confirmation = window.confirm(
    "Are you sure you want to upload this resume? This will replace any existing resume."
    );
    
    if (confirmation) {
      if (resumeFile) {
        setEditedUser((prev) => ({
          ...prev,
          resume: URL.createObjectURL(resumeFile),
        }));
        setIsUploaded(true);
        alert("Resume uploaded successfully!");
      }
    } else {
      alert("No file selected for upload.");
    }
  };

  const handleResumeDelete = () => {
    const confirmation = window.confirm(
    "Are you sure you want to delete your resume? This action cannot be undone."
    );
    if (confirmation) {
      setEditedUser((prev) => ({ ...prev, resume: null }));
      setIsUploaded(false);
      alert("Resume deleted successfully!");
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
   

    if (!editedUser._id) {
      alert('User ID is missing. Unable to update profile.');
       return;
    }

    console.log(editedUser._id);

    try {
      const response = await axios.put(`https://findme-1-77d9.onrender.com/api/users/update/${editedUser._id}`, editedUser);
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
<div className="form-group">
  <label htmlFor="resume">Resume</label>
  <input
    type="file"
    id="resume"
    name="resume"
    className="input-field"
    accept=".docx, .png, .jpeg, .pdf" // Restrict file types
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const allowedExtensions = ["docx", "png", "jpeg", "pdf"];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxSize = 2 * 1024 * 1024; // 2 MB in bytes

        if (!allowedExtensions.includes(fileExtension)) {
          alert("Invalid file type. Please upload a .docx, .png, .jpeg, or .pdf file.");
          e.target.value = ""; // Clear the input
        } else if (file.size > maxSize) {
          alert("File size exceeds the limit of 2 MB. Please upload a smaller file.");
          e.target.value = ""; // Clear the input
        } else {
          setResumeFile(file); // Process the file if it's valid
        }
      }
    }}
  />
    <small className="text-muted">
    Allowed file types: .docx, .png, .jpeg, .pdf | Max size: 2 MB
  </small> {/* Display allowed file types */}
  {!isUploaded && (
    <button type='button' onClick={handleResumeUpload}>Upload</button>
  )}
  {isUploaded && (
    <>
      <a href={editedUser.resume} target="_blank" rel="noopener noreferrer">View Current Resume</a>
      <button type='button' onClick={handleResumeDelete}>Delete Resume</button>
    </>
  )}
</div>

    
      
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Update</button>
      </div>
    
  </form>
      
     
    
  );
};

export default UserProfile;
