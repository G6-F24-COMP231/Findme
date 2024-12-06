// AddServicePage Component: Allows users to add a new service
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../styles/AddServicePage.css";
import { useContext } from 'react';
import { UserContext } from './../UserContext';

function AddServicePage() {
    const { user } = useContext(UserContext); // Retrieve user context
    const userId = user?.id;// Safely access user ID
    const [serviceName, setServiceName] = useState("");// State for service name
    const [location, setLocation] = useState("");// State for location
    const [languages, setLanguages] = useState("");// State for languages
    const [price, setPrice] = useState("");// State for price
    const [availableDays, setAvailableDays] = useState([]);// State for available days
    const [startTime, setStartTime] = useState("09:00 AM");// Default start time
    const [endTime, setEndTime] = useState("05:00 PM");// Default end time
    const navigate = useNavigate();

    /**
     * Toggles the selection of a day in the availableDays state.
     * @param {string} day - The day to toggle.
     */
    const handleDayChange = (day) => {
        setAvailableDays((prevDays) =>
            prevDays.includes(day)
                ? prevDays.filter((d) => d !== day)
                : [...prevDays, day]
        );
    };

    
    /**
     * Handles form submission to create a new service.
     * @param {Event} e - Form submit event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct the new service object
        const newService = {
            serviceName,
            location,
            languages: languages.split(","),// Convert string to array
            price: parseFloat(price),// Convert price to a number
            availableDays,
            startTime,
            endTime,
        };

        
        try {
             
            // API call to create a new service
            const response = await axios.post(
                `https://findme-1-77d9.onrender.com/api/services/users/${userId}/services`, 
                newService
            );
    
            console.log('Service created successfully:', response.data);
            alert('Service created successfully');
            navigate('/profile'); // Redirect to profile page
        } catch (error) {
            console.error('Error creating service:', error);
            alert('Failed to create service. Please try again.');
        }

        navigate('/profile');
    };

    return (
        <div className="add-service-page">
            <header>
                <h1>Add a New Service</h1>
            </header>
            <form onSubmit={handleSubmit} className="add-service-form">
                {/* Service Name Input */}
                <label>
                    Service Name:
                    <input
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                    />
                </label>

                {/* Location Input */}
                <label>
                    Location:
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </label>

                {/* Languages Input */}
                <label>
                    Languages:
                    <input
                        type="text"
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        required
                    />
                </label>

                {/* Price Input */}
                <label>
                    Rate ($/hour):
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>

                {/* Available Days Selection */}
                <div className="available-days">
                    <p>Available Days:</p>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                checked={availableDays.includes(day)}
                                onChange={() => handleDayChange(day)}
                            />
                            {day}
                        </label>
                    ))}
                </div>

                {/* Start and End Time Inputs */}
                <label>
                    Start Time:
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </label>
                <label>
                    End Time:
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </label>

                {/* Form Buttons */}
                <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
                    <button type="submit" className="submit-button">Create Service</button>
                </div>
            </form>
        </div>
    );
}

export default AddServicePage;