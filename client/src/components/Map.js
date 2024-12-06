import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 37.7749, // Default latitude (San Francisco)
  lng: -122.4194, // Default longitude (San Francisco)
};


/**
 * Function to calculate the distance between two geographical points
 * using the Haversine formula.
 * 
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lng1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lng2 - Longitude of the second point.
 * @returns {number} The distance in kilometers.
 */
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance;
};

const Map = () => {
  const [userLocation, setUserLocation] = useState(defaultCenter); // Default location
  const [error, setError] = useState(null);// Error handling state
  const [serviceProviderLocation] = useState({ lat: 37.7749, lng: -122.4194 }); // Example: Service Provider's Location (San Francisco)
  const [distance, setDistance] = useState(null); // Distance between user and service provider

  useEffect(() => {
    // Attempt to fetch the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          console.log("Fetched User Location: ", newLocation); // Debugging log
          setUserLocation(newLocation); // Update state with user's location
          setError(null);
        },
        (error) => {
          console.error("Geolocation Error: ", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("Location access denied. Please allow location access.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("The request to get your location timed out.");
              break;
            default:
              setError("An unknown error occurred while fetching location.");
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    // Only calculate distance if both user and service provider locations are available
    if (userLocation && serviceProviderLocation) {
      // Calculate distance using Haversine formula
      const calculatedDistance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        serviceProviderLocation.lat,
        serviceProviderLocation.lng
      );
      setDistance(calculatedDistance);
    }
  }, [userLocation, serviceProviderLocation]);

  return (
    <div>
      {/* Display error message if there is an error */}
      {error && (
        <div>
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry Location Access
          </button>
        </div>
      )}

      {/* Google Map displaying the user's current location */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation} // Dynamically update map center
        zoom={12} // Adjust zoom for better visibility
      >
        {/* Render marker only if userLocation is available */}
        {userLocation && <Marker position={userLocation} />}
      </GoogleMap>
    </div>
  );
};

export default Map;
