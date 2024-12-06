// ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ServiceCard component represents an individual service in the service list.
 * It displays the service title, location, price, and a link to view more details about the service.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - The unique identifier of the service.
 * @param {string} props.title - The title of the service.
 * @param {string} props.location - The location where the service is available.
 * @param {string} props.languages - The languages offered (not displayed in the UI, could be used in the future).
 * @param {string} props.pricePerHour - The hourly price for the service.
 * 
 * @returns {JSX.Element} The ServiceCard component displaying service information.
 */
function ServiceCard({ id, title, location, languages, pricePerHour }) {
  console.log(id);// Log the service ID for debugging purposes

  return (
    <div className="service">
      <h3>{title}</h3>
      
      <p>
        <strong>Location:</strong> {location}{/* Display the service location */}
      </p>
      
      <p>
        <strong>Price per Hour:</strong> ${pricePerHour}/Hour {/* Display the price per hour */}
      </p>
      
      {/* Link to the service details page using the service ID */}
      <Link to={`/services/${id}`} className="view-details-button">
        View More Details
      </Link>
    </div>
  );
}

export default ServiceCard;
