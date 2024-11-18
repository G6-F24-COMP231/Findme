import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ServiceDetailsPage.css";
import { UserContext } from './../UserContext';
import axios from 'axios';

// Import Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faMapMarkerAlt, faFileDownload, faLanguage, faCalendarAlt, faClock, faDollarSign, faCheckCircle, faCreditCard, faPerson } from "@fortawesome/free-solid-svg-icons";

function ServiceDetailsPage() {
  const { serviceId } = useParams(); // Get the service ID from the URL parameters
  const navigate = useNavigate(); // Initialize navigate function
  const [serviceData, setServiceData] = useState(null); // State to store fetched service data
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayTimes, setDayTimes] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const { user } = useContext(UserContext); // Get the logged-in user's info
  const pricePerHour = serviceData ? serviceData.pricePerHour : 0; // Use the price from fetched data

  useEffect(() => {
    // Fetch service data from backend
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/services/${serviceId}`);
        setServiceData(response.data);
      } catch (error) {
        console.error("Error fetching service data:", error);
        alert("Failed to load service data.");
      }
    };

    fetchServiceData();
  }, [serviceId]);

  const handleDaySelection = (day) => {
    const isSelected = selectedDays.includes(day);
    const updatedSelectedDays = isSelected
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];

    setSelectedDays(updatedSelectedDays); // Update the state first

    const updatedDayTimes = { ...dayTimes };
    if (isSelected) {
      delete updatedDayTimes[day];
    } else {
      updatedDayTimes[day] = {
        startTime: "09:00",
        endTime: "17:00",
      };
    }

    setDayTimes(updatedDayTimes);
    calculateSubtotal(updatedSelectedDays, updatedDayTimes); // Call calculation with updated values
  };

  const handleTimeChange = (day, timeType, value) => {
    const updatedDayTimes = {
      ...dayTimes,
      [day]: {
        ...dayTimes[day],
        [timeType]: value,
      },
    };

    setDayTimes(updatedDayTimes);
    calculateSubtotal(selectedDays, updatedDayTimes); // Pass latest states for calculation
  };



  const getTimeInHours = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  const calculateSubtotal = (updatedSelectedDays, updatedDayTimes) => {
    if (!serviceData || !pricePerHour) return;

    const totalHours = updatedSelectedDays.reduce((sum, day) => {
      const times = updatedDayTimes[day];
      if (times && times.startTime && times.endTime) {
        const start = getTimeInHours(times.startTime);
        const end = getTimeInHours(times.endTime);
        const hours = end - start;
        return sum + (hours > 0 ? hours : 0);
      } else {
        return sum;
      }
    }, 0);

    setSubtotal(totalHours * pricePerHour);
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handlePay = async () => {
    const serviceSeekerId = user ? user.id : null;
    if (!serviceSeekerId) {
      alert("You need to be logged in to book a service.");
      return;
    }

    const serviceProviderId = serviceData ? serviceData.serviceProviderId : null;
    if (!serviceProviderId) {
      alert("Service provider information is missing.");
      return;
    }

    const bookingDetails = {
      serviceId,
      serviceSeekerId,
      serviceProviderId,
      selectedDays,
      dayTimes,
      subtotal,
      paymentInfo,
    };

    try {
      await axios.post('http://localhost:5001/api/bookings/create-booking', bookingDetails);
      alert("Payment Successful!");
      setSelectedDays([]);
      setDayTimes({});
      setSubtotal(0);
      setPaymentInfo({ cardNumber: "", expiryDate: "", cvv: "" });
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment.");
    }
  };

  if (!serviceData) {
    return <div>Loading...</div>;
  }

  const { title, username, location, languages, availableDays, startTime, endTime, resumeUrl, price } = serviceData || {};

  return (
    <div className="service-details">
      <div className="back-icon" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
      </div>

      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="initials">
              {username ? username.charAt(0) : ""}
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
        {resumeUrl && (
          <a href={resumeUrl} download className="download-resume">
            <FontAwesomeIcon icon={faFileDownload} /> Download Resume
          </a>
        )}
        <div className="profile-details">
          <p>
            <FontAwesomeIcon icon={faLanguage} /> <strong>Languages:</strong> {languages && languages.join(", ")}
          </p>
          <p>
            <FontAwesomeIcon icon={faCalendarAlt} /> <strong>Available Days:</strong>
          </p>
          <div className="days">
            {availableDays && availableDays.map((day) => (
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
      </div>

      <div className="booking-form">
        <h3>Book Service</h3>
        <div className="form-group">
          <label>Select Days:</label>
          <div className="days-select">
            {availableDays && availableDays.map((day) => (
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
          <>
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

            <div className="invoice">
              <h3>Invoice</h3>
              <p>
                <FontAwesomeIcon icon={faDollarSign} /> Subtotal: <strong>${subtotal.toFixed(2)}</strong>
              </p>
              <h3>
                <FontAwesomeIcon icon={faCreditCard} /> Payment Information
              </h3>
              <div className="form-group">
                <label>Card Number:</label>
                <input type="text" name="cardNumber" value={paymentInfo.cardNumber} onChange={handlePaymentChange} />
              </div>
              <div className="form-group">
                <label>Expiry Date:</label>
                <input type="text" name="expiryDate" placeholder="MM/YY" value={paymentInfo.expiryDate} onChange={handlePaymentChange} />
              </div>
              <div className="form-group">
                <label>CVV:</label>
                <input type="text" name="cvv" value={paymentInfo.cvv} onChange={handlePaymentChange} />
              </div>
              <button onClick={handlePay} className="pay-button">
                Pay
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ServiceDetailsPage;
