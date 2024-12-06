import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserContext, UserProvider } from "../UserContext";
import "../styles/ServiceDetailsPage.css";
import axios from 'axios';
import Modal from "react-modal";


// Import Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faMapMarkerAlt, faFileDownload, faLanguage, faCalendarAlt, faClock, faDollarSign, faCheckCircle, faCreditCard, faPerson, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
import CheckoutForm from "./CheckoutForm"


/**
 * ServiceDetailsPage Component
 *
 * This page displays the detailed information about a service, including:
 * - The service provider's information.
 * - Ratings and reviews for the service.
 * - Available days and time slots for booking.
 * - Ability to report an issue with the service.
 * - The ability to add the service to favorites.
 *
 * The component also handles booking a service by selecting days and times, calculating the subtotal, and proceeding to payment.
 *
 * @returns {JSX.Element} The rendered service details page.
 */
function ServiceDetailsPage() {
  const { serviceId } = useParams(); // Get the service ID from the URL parameters
  const navigate = useNavigate(); // Initialize navigate function
  const [serviceData, setServiceData] = useState(null); // State to store fetched service data
  const [selectedDays, setSelectedDays] = useState([]); // Selected days for booking
  const [dayTimes, setDayTimes] = useState({}); // Selected time slots for each day
  const [subtotal, setSubtotal] = useState(0); // Total price for selected booking
  const { user } = useContext(UserContext); // Access the current logged-in user from context
  const [service, setService] = useState(null); // Store detailed service data
  const [ratings, setRatings] = useState([]); // To store existing ratings
  const [averageRating, setAverageRating] = useState(0); // Store average rating
  const [isHeartSolid, setIsHeartSolid] = useState(false); // Toggle heart for favorites
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const pricePerHour = serviceData ? serviceData.pricePerHour : 0; // Use the price from fetched data

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportComment, setReportComment] = useState("");

  const handleOpenReportModal = () => setIsReportModalOpen(true);
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReportType("");
    setReportComment("");
  };

  const handleReportSubmit = async () => {
    if (!reportType) {
      alert("Please select a report type.");
      return;
    }

    const reportData = {
      serviceId,
      userId: user ? user._id : null,
      reportType,
      comment: reportComment,
    };

    alert("Your report has been submitted successfully.");
  handleCloseReportModal();
  
  };
  
  const userId = user ? user._id: null;

  // Fetch service data on component mount
  useEffect(() => {
    // Simulate fetching data from backend
    const fetchServiceData = async () => {
      

      try {
        console.log(serviceId);
        const response = await axios.get(`https://findme-1-77d9.onrender.com/api/services/${serviceId}`);
        console.log(response.data);
        setServiceData(response.data);
      } catch (error) {
        console.error("Error fetching service data:", error);
        alert("Failed to load service data.");
      }
  
    };

    fetchServiceData();
  }, [serviceId]);

  // Fetch service details and reviews
useEffect(() => {
  const fetchServiceDetails = async () => {
    try {
      // Fetch service data
      const serviceResponse = await axios.get(`https://findme-1-77d9.onrender.com/api/services/${serviceId}`);
      setService(serviceResponse.data);

      // Fetch reviews for the specific service
      const reviewsResponse = await axios.get(`https://findme-1-77d9.onrender.com/api/reviews/${serviceId}`);
      setRatings(reviewsResponse.data);

      // Calculate the average rating for the specific service
      const avgRating =
        reviewsResponse.data.reduce((acc, review) => acc + review.rating, 0) /
        reviewsResponse.data.length || 0;
      setAverageRating(avgRating.toFixed(1));
    } catch (error) {
      console.error("Error fetching service details or reviews:", error);
    }
  };

  fetchServiceDetails();
}, [serviceId]);


  const handleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      // Remove day
      setSelectedDays((prevDays) => prevDays.filter((d) => d !== day));
      setDayTimes((prevTimes) => {
        const newTimes = { ...prevTimes };
        delete newTimes[day];
        return newTimes;
      });
    } else {
      // Add day with default times
      setSelectedDays((prevDays) => [...prevDays, day]);
      setDayTimes((prevTimes) => ({
        ...prevTimes,
        [day]: {
          startTime: "09:00",
          endTime: "17:00",
        },
      }));
    }
  };

  const handleTimeChange = (day, timeType, value) => {
    setDayTimes((prevTimes) => ({
      ...prevTimes,
      [day]: {
        ...prevTimes[day],
        [timeType]: value,
      },
    }));
  };

  const getTimeInHours = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      alert("You must be logged in to add favorites.");
      return;
    }

    try {
      
      setIsHeartSolid(!isHeartSolid)
      console.log(user.id);
      console.log(serviceId);
      const response = await axios.post(`https://findme-1-77d9.onrender.com/api/users/${user.id}/favorites/${serviceId}/toggle`);
      alert("Service added to favorites!");
    } catch (error) {
      console.error("Error adding to favorites: ", error);
      alert("Failed to add service to favorites.");
    }
  };

  useEffect(() => {

    if (!serviceData || !price) return;

    const totalHours = selectedDays.reduce((sum, day) => {
      const times = dayTimes[day];
      if (times && times.startTime && times.endTime) {
        const start = getTimeInHours(times.startTime);
        const end = getTimeInHours(times.endTime);
        const hours = end - start;
        return sum + (hours > 0 ? hours : 0);
      } else {
        return sum;
      }
    }, 0);
    setSubtotal(totalHours * price);
  }, [selectedDays, dayTimes, pricePerHour]);

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handlePay = () => {
    alert("Payment Successful!");
    // Reset form
    setSelectedDays([]);
    setDayTimes({});
    setSubtotal(0);
    setPaymentInfo({ cardNumber: "", expiryDate: "", cvv: "" });
  };

  if (!serviceData) {
    return <div>Loading...</div>;
  }

  const { title, username, location, languages, availableDays, startTime, endTime, resumeUrl, price } = serviceData;

 // Function to render stars based on the rating
const renderStars = (rating) => {
  if (rating === 0 || !rating) {
    return "☆☆☆☆☆"; // Display empty stars when there's no rating
  }

  const fullStars = Math.floor(rating); // Number of full stars
  const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Half star logic
  const emptyStars = 5 - fullStars - halfStar; // Remaining empty stars

  // Generate the stars as a string
  return (
    <>
      {"★".repeat(fullStars)} {/* Full stars */}
      {halfStar ? "⯪" : ""}   {/* Half star if applicable */}
      {"☆".repeat(emptyStars)} {/* Empty stars */}
    </>
  );
};
  console.log(serviceId);
  return (

    <div className="service-details">
      <div className="back-icon" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
      </div>

      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="initials">
              {/* {providerFirstName.charAt(0)}
              {providerLastName.charAt(0)} */}
              {username.charAt(0)}
            </span>
          </div>
          <div className="profile-info">
            <h2>{title}</h2>
            <p className="service-type">
              <FontAwesomeIcon icon={faPerson} /> {username}
            </p>
            <p className="location">
              <FontAwesomeIcon icon={faMapMarkerAlt} /> {location}
            </p>
          </div>
        </div>
        <a href={resumeUrl} download className="download-resume">
          <FontAwesomeIcon icon={faFileDownload} /> Download Resume
        </a>
        <button
          className="btn"
          onClick={handleAddToFavorites }
          style={{ marginLeft: "10px", background: "none", border: "none", cursor: "pointer" }}
        >
          <FontAwesomeIcon
            icon={isHeartSolid ? faHeart : faHeartOutline}
            style={{ color: isHeartSolid ? "red" : "gray", fontSize: "1.5rem" }}
          />
        </button>
        
        <div className="profile-details">
          <p>
            <FontAwesomeIcon icon={faLanguage} /> <strong>Languages:</strong> {languages.join(", ")}
          </p>
          <p>
            <FontAwesomeIcon icon={faCalendarAlt} /> <strong>Available Days:</strong>
          </p>
          <div className="days">
            {availableDays.map((day) => (
              <span key={day} className="day">
                {day}
              </span>
            ))}
          </div>
          <p>
            <FontAwesomeIcon icon={faClock} /> <strong>Start Time:</strong> {startTime}
          </p>
          <p>
            <FontAwesomeIcon icon={faClock} /> <strong>End Time:</strong> {endTime}
          </p>
          <p>
            <FontAwesomeIcon icon={faDollarSign} /> <strong>Price per Hour:</strong> ${price}
          </p>
        </div>

        {/* Report Button */}
      <button className="btn btn-danger mt-3" onClick={handleOpenReportModal}>
        Report
      </button>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onRequestClose={handleCloseReportModal}
        contentLabel="Report Malicious Activity"
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
          content: { color: 'black', padding: '20px', borderRadius: '10px' }
        }}
      >
        <h2>Report Malicious Activity</h2>
        <div className="form-group">
          <label htmlFor="reportType">Type of Activity:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="form-control"
          >
            <option value="">Select...</option>
            <option value="Fraud">Fraud</option>
            <option value="Spam">Spam</option>
            <option value="Hate Speech">Hate Speech</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="reportComment">Comments:</label>
          <textarea
            id="reportComment"
            value={reportComment}
            onChange={(e) => setReportComment(e.target.value)}
            className="form-control"
            rows="4"
            placeholder="Describe the issue..."
          ></textarea>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleCloseReportModal}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleReportSubmit}>
            Submit
          </button>
        </div>
      </Modal>

              
        {/* Ratings Section */}

        
        <section className="ratings-section">
        <p>Ratings & Reviews</p>
        <p>
          <strong>Average Rating:</strong> 
          <span className="stars"> 
            {renderStars(averageRating)} {/* Display the average rating stars */}
          </span>
        </p>
        
        {/* If there are no reviews, display a message */}
        {ratings.length === 0 && (
          <p>No ratings yet. Be the first to check back for updates!</p>
        )}
      </section>
        <Link 
        
        to=
          
            '/review'
            state= {{serviceId}}
          className="btn btn-primary mt-3">
              Write a Review
        </Link>
        <button className="btn btn-secondary mt-3" onClick={handleAddToFavorites}>
          Add to Favorites
        </button>
      </div>
      
      

      <div className="booking-form">
        <h3>Book Service</h3>
        <div className="form-group">
          <label>Select Days:</label>
          <div className="days-select">
            {availableDays.map((day) => (
              <label key={day} className="checkbox-label">
                <input type="checkbox" value={day} checked={selectedDays.includes(day)} onChange={() => handleDaySelection(day)} />
                <span className="custom-checkbox">
                  <FontAwesomeIcon icon={faCheckCircle} />
                </span>
                {day}
              </label>
            ))}
          </div>
        </div>

        {selectedDays.length > 0 && (
          <div className="time-inputs">
            {selectedDays.map((day) => (
              <div key={day} className="time-selection">
                <h4>{day}</h4>
                <div className="time-group">
                  <label>Start Time:</label>
                  <input type="time" value={dayTimes[day]?.startTime || ""} onChange={(e) => handleTimeChange(day, "startTime", e.target.value)} />
                </div>
                <div className="time-group">
                  <label>End Time:</label>
                  <input type="time" value={dayTimes[day]?.endTime || ""} onChange={(e) => handleTimeChange(day, "endTime", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}

        {subtotal > 0 && (
          <CheckoutForm subtotal={subtotal} user={user} service={service} dayTimes={dayTimes}/>
        )}
      </div>
    </div>
  );
}

export default ServiceDetailsPage;
