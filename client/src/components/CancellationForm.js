import React, { useRef, useState, useContext } from 'react';
import emailjs from '@emailjs/browser';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate  } from 'react-router-dom';
import { UserContext } from './../UserContext';
import axios from 'axios';


/**
 * CancellationFormUI component allows the user to provide a reason for canceling the booking and sends an email, then cancels the booking.
 */
const CancellationFormUI = () => {
  const { bookingId } = useParams(); // Retrieve the booking ID from URL parameters
  const form = useRef(); // Reference to the form element
  const [message, setMessage] = useState(''); // Local state for handling any additional messages (optional)
  const { user: contextUser } = useContext(UserContext); // Access the logged-in user's data from context
  const navigate = useNavigate(); // Hook for navigation


   /**
   * Handles the cancellation of the booking by sending an email and making an API call to cancel the booking.
   * @param {Object} e - The event object from form submission.
   */
  const cancelBooking = async (e) => {
    e.preventDefault();// Prevent the default form submission behavior

    // Check if bookingId exists before proceeding
    if (!bookingId) {
      alert('Booking ID not found.');
      return;
    }

    try {
      // Send the cancellation email
      await emailjs.sendForm(
        'service_debeiyt', // EmailJS service ID
        'template_3s3y15a', // EmailJS template ID
        form.current, // Form reference to send the form data
        { publicKey: '9B_G4UOwgNSsEHZiJ' } // EmailJS public key
      );
      alert('Cancellation email sent successfully.');

      // Make API call to cancel the booking
      await axios.delete(`https://findme-1-77d9.onrender.com/api/bookings/${bookingId}`);
      alert('Booking cancelled successfully.');

      // Navigate to the bookings page after cancellation
      navigate('/bookings');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again later.');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow-sm" style={{ maxWidth: '700px', width: '100%' }}>
        <div className="card-body">
          <form ref={form} onSubmit={cancelBooking}>
            <div className="mb-4">
              <input type="hidden" name="username" value={contextUser.username} />
              <input type="hidden" name="email" value={contextUser.email} />
              
              {/* Reason for cancellation text area */}
              <label htmlFor="cancellationReason" className="form-label">
                Describe your reason for cancelling
              </label>
              <textarea
                className="form-control"
                id="cancellationReason"
                name="cancellationReason"
                rows="4"
                aria-describedby="cancellationReasonHelp"
                required
              ></textarea>
              <div id="cancellationReasonHelp" className="form-text">
                Please provide details about why you're cancelling your booking.
              </div>
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/bookings')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger">
                End Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CancellationFormUI;
