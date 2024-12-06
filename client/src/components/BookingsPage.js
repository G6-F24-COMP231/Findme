/**
 * BookingHistoryPage Component: Displays the booking history for the logged-in user.
 * Users can view details about their bookings, including the service name, time slots, 
 * amount paid, status, and location.
 */
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock, faDollarSign, faInfoCircle, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState(null); // Stores user's booking data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { user } = useContext(UserContext); // User context
  const navigate = useNavigate(); // Navigation function

  /**
   * Fetches the bookings for the logged-in user from the server.
   * Executed on component mount and whenever the user context changes.
   */
  useEffect(() => {
    const fetchBookings = async () => {
      if (user && user.id) {
        try {
          console.log('Fetching bookings for user:', user.id);
          const response = await axios.get(`https://findme-1-77d9.onrender.com/api/bookings/user/${user.id}`);
          console.log('Bookings response:', response.data);
          setBookings(response.data);
        } catch (error) {
          console.error('Error fetching bookings:', error);
          setError(error.response?.data?.message || 'Failed to fetch bookings');
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No user found in context');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);


  // Display loading or error states
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="booking-history-page">
      {/* Page Header */}
      <header className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Booking History</h1>
          <p className="text-gray-600 mt-2">View and manage your service bookings</p>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/why-find-me">Why Find Me</Link>
        <Link to="/listofservices">Find Talent</Link>
        <Link to="/contact">Contact</Link>
        {user ? (
          <>
            <Link title="Click to show profile" to="/profile">Welcome {user?.username}</Link>
            <Link to="/add-service" className="add-service-link">Add Service</Link>
            <Link to="/bookings">Bookings</Link>
          </>
        ) : (
          <>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>

      <div className="container mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No bookings found.</p>
            <p className="mt-2">User ID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
          </div>
        ) : (
          <div >
            {bookings.map((booking) => (
              <div key={booking._id} className="service">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">
                    {booking.serviceName || 'Unknown Service'}
                  </h2>
                  <div className="text-gray-600 space-y-2" >
                    <p>
                      <FontAwesomeIcon style={{ marginRight: '5px' }} icon={faCalendarAlt} className="mr-2" />
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </p>
                    {booking.timeSlot.map((slot, index) => (
                      <div key={index}>
                        <p>
                          <FontAwesomeIcon style={{ marginRight: '5px' }} icon={faClock} className="mr-2" />
                          Day: {slot.day}
                        </p>
                        <p style={{ marginLeft: '21px' }}>
                          Time: {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                    ))}
                    <p>
                      <FontAwesomeIcon style={{ marginRight: '5px' }}icon={faDollarSign} className="mr-2" />
                      Amount: ${booking.amount}
                    </p>
                    <p>
                      <FontAwesomeIcon style={{ marginRight: '5px' }} icon={faInfoCircle} className="mr-2" />
                      Status: {booking.paymentInfo.paymentStatus}
                    </p>
                    <p>
                      <FontAwesomeIcon style={{ marginRight: '5px' }} icon={faMapMarkerAlt} className="mr-2" />
                      Location: {booking.location}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <Link
                    to={`/services/${booking.serviceProvider}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Service Provider
                  </Link>
                  <Link
                    to={`/cancel/${booking._id}`}
                    className="text-red-500 hover:underline "
                    style={{ marginLeft: '20px' }}
                  >
                    Cancel Booking
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
