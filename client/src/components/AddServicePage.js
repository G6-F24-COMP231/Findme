// AddServicePage Component for adding a new service
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./AddServicePage.css";
import { useContext } from 'react';
import { UserContext } from './../UserContext';

function AddServicePage() {
    const { user } = useContext(UserContext);
    console.log(user);
    const userId = user?.id;
    console.log(userId);
    const [serviceName, setServiceName] = useState("");
    const [location, setLocation] = useState("");
    const [languages, setLanguages] = useState("");
    const [price, setPrice] = useState("");
    const [availableDays, setAvailableDays] = useState([]);
    const [startTime, setStartTime] = useState("09:00 AM");
    const [endTime, setEndTime] = useState("05:00 PM");
    const navigate = useNavigate();

    const handleDayChange = (day) => {
        setAvailableDays((prevDays) =>
            prevDays.includes(day)
                ? prevDays.filter((d) => d !== day)
                : [...prevDays, day]
        );
    };

    //console.log(user);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newService = {
            serviceName,
            location,
            languages: languages.split(","),
            price: parseFloat(price),
            availableDays,
            startTime,
            endTime,
        };

        // Add backend integration here to submit the new service
        try {
             // Replace with the actual user ID, possibly from your authentication state
            
            const response = await axios.post(
                `http://localhost:5001/api/users/${userId}/services`, // Adjust the URL as per your backend route
                newService
            );
    
            console.log('Service created successfully:', response.data);
            alert('Service created successfully');
            navigate('/profile'); // Redirect to the profile page after successful submission
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
                <label>
                    Service Name:
                    <input
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Languages (comma-separated):
                    <input
                        type="text"
                        value={languages}
                        onChange={(e) => setLanguages(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Rate ($/hour):
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
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
                <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={() => navigate('/')}>Cancel</button>
                    <button type="submit" className="submit-button">Create Service</button>
                </div>
            </form>
        </div>
    );
}

export default AddServicePage;