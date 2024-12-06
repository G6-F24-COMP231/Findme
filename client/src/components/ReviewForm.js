import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Star } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useLocation } from "react-router-dom";

/**
 * UserReviewForm Component
 * 
 * This component allows users to write and submit reviews for a service. It includes functionality to handle 
 * user input, rating (stars), and the submission of the review.
 *
 * @returns {JSX.Element} The rendered review form.
 */
export default function UserReviewForm() {
  const [rating, setRating] = useState(0); // State to hold the selected rating value (1 to 5 stars)
  const [hover, setHover] = useState(0); // State to handle hover effect on stars
  const [formData, setFormData] = useState({ title: '', review: '' }); // State to hold form data
  const navigate = useNavigate();
  
  const { user } = useContext(UserContext); // Accessing the current logged-in user from context
  const location = useLocation(); // Accessing location state for serviceId
  const { serviceId } = location.state || {}; // Extracting serviceId from location state
 
  /**
   * Handles the input change for the title and review fields.
   * 
   * @param {object} e - The event object from the input field.
   */
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };


  /**
   * Handles the form submission.
   * Sends the review data to the backend and performs necessary validation.
   * 
   * @param {object} event - The event object from the form submit.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the user is logged in
    if (!user) {
      alert('You need to be logged in to submit a review.');
      return;
    }

    // send form data to backend along with userId
    try {
      const response = await axios.post('https://findme-1-77d9.onrender.com/api/reviews', {
        title: formData.title,
        review: formData.review,
        rating,
        userId: serviceId,
      });

      console.log('Review submitted successfully:', response.data);
      alert('Review submitted!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }

    navigate("/");// Redirect to home page after submission
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Write a Review</h5>
              <h6 className="card-subtitle mb-2 text-muted">Share your experience</h6>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>

                {/* Review Title Input */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Review Title</label>
                  <input type="text" className="form-control" id="title" value={formData.title} onChange={handleInputChange} placeholder="Summarize your experience" required />
                </div>

                {/* Review Content Textarea */}
                <div className="mb-3">
                  <label htmlFor="review" className="form-label">Your Review</label>
                  <textarea className="form-control" id="review" value={formData.review} onChange={handleInputChange} rows="3" placeholder="Tell us what you liked or disliked" required></textarea>
                </div>

                {/* Rating Selection (Stars) */}
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div className="d-flex">
                    {
                      // Algorithm: Render 5 stars, update the rating on click, and show hover effect
                      [...Array(5)].map((_, index) => {
                      const ratingValue = index + 1;


                      return (
                        <Star
                          key={index}
                          size={24} // Set the size of the stars
                          onClick={() => setRating(ratingValue)} // Set rating on click
                          onMouseEnter={() => setHover(ratingValue)} // Set hover value
                          onMouseLeave={() => setHover(0)} // Reset hover on mouse leave
                          fill={ratingValue <= (hover || rating) ? "gold" : "none"} // Fill the star with gold based on rating or hover
                          stroke={ratingValue <= (hover || rating) ? "gold" : "currentColor"} // Set stroke color based on rating or hover
                          style={{ cursor: 'pointer', marginRight: '5px' }} // Add pointer cursor and spacing between stars
                        />
                      );
                    })}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Submit Review</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}