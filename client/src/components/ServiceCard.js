// ServiceCard.js
import React from 'react';
import { Link } from 'react-router-dom';

function ServiceCard({ id, title, location, languages, pricePerHour }) {
  console.log(id);
  return (
    <div className="service">
      <h3>{title}</h3>
      {/* <p>
        <strong>Service:</strong> {title}
      </p> */}
      <p>
        <strong>Location:</strong> {location}
      </p>
      <p>
        <strong>Languages:</strong> {languages?.join(", ")}
      </p>
      <p>
        <strong>Price per Hour:</strong> ${pricePerHour}/Hour
      </p>
      
      <Link to={`/services/${id}`} className="view-details-button">
        View More Details
      </Link>
    </div>
  );
}

export default ServiceCard;
