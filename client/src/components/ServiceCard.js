// ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';


/**
 * ServiceCard Component
 * 
 * This component displays a card for a service, showing details such as:
 * - Title
 * - Location
 * - Languages spoken
 * - Price per hour
 * 
 * The card also includes a link to the service's detailed page.
 *
 * @param {Object} props - The properties passed to the component
 * @param {string} props.id - The unique identifier for the service
 * @param {string} props.title - The title of the service
 * @param {string} props.location - The location of the service provider
 * @param {Array<string>} props.languages - The languages spoken by the service provider
 * @param {number} props.pricePerHour - The price per hour of the service
 *
 * @returns {JSX.Element} The rendered service card component.
 */
function ServiceCard({ id, title, location, languages, pricePerHour }) {
  console.log(id);
  return (
    <div className="service">
      <h3>{title}</h3>
      
      <p>
        <strong>Location:</strong> {location}{/* Display the service location */}
      </p>
      <p>
        <strong>Languages:</strong> {languages?.join(", ")}  {/* Display the languages spoken */}
      </p>
      <p>
        <strong>Price per Hour:</strong> ${pricePerHour}/Hour {/* Display the price per hour */}
      </p>
      
      {/* Link to the service details page */}
      <Link to={`/services/${id}`} className="view-details-button">
        View More Details
      </Link>
    </div>
  );
}

export default ServiceCard;
