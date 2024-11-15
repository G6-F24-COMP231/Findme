import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Hompage.css";

function HomePage() {
  const [query, setQuery] = useState("");
  const [services, setServices] = useState([]); // State to store services data
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchServices = async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Demo data with updated fields
      const demoServices = [
        {
          id: "1",
          title: "Software Developer",
          location: "San Francisco, CA",
          languages: ["Java", "Python", "C++"],
          pricePerHour: 60,
        },
        {
          id: "2",
          title: "Experienced Carpenter",
          location: "Austin, TX",
          languages: ["English", "Spanish"],
          pricePerHour: 40,
        },
        {
          id: "3",
          title: "Data Analyst",
          location: "New York, NY",
          languages: ["SQL", "Python", "R"],
          pricePerHour: 50,
        },
        {
          id: "4",
          title: "Cleaner",
          location: "Los Angeles, CA",
          languages: ["English"],
          pricePerHour: 25,
        },
        // Add more demo services as needed
      ];

      setServices(demoServices);
    };

    fetchServices();
  }, []);

  const handleSearch = () => {
    // Redirect to search results page, passing the query as a URL parameter

    // const url = maxPrice ? `/search-results?q=${query}&maxPrice=${maxPrice}` : `/search-results?q=${query}`;
    // console.log()
    // navigate(url);

    navigate(`/search-results?q=${query}`);
  };

  return (
    <div>
      <header>
        <h1>Find Me</h1>
        <p>Explore thousands of services available near you!</p>
      </header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/why-find-me">Why Find Me</Link>
        <Link to="/listofservices">Find Talent</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Login</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <div className="body_container">
        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search services by keyword" value={query} onChange={(e) => setQuery(e.target.value)} />
          {/* <select>
            <option value="">Filter</option>
            <option value="option">#Option#</option>
          </select> */}

          {/* <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
            <option value="">Max Price</option>
            <option value="25">25/hour</option>
            <option value="35">35/hour</option>
            <option value="45">45/hour</option>
            <option value="60">60/hour</option>
          </select> */}

          <button type="button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Services Sections */}
        <section className="services">
          <div className="section-content">
            <h2 className="section-title">Available Services</h2>
            {services.length > 0 ? (
              <div className="service-list">
                {services.map((service) => (
                  <ServiceCard key={service.id} id={service.id} title={service.title} location={service.location} languages={service.languages} pricePerHour={service.pricePerHour} />
                ))}
              </div>
            ) : (
              <p>Loading services...</p>
            )}
          </div>
        </section>
      </div>

      <footer>
        <p>&copy; 2024 Service Listings. All rights reserved.</p>
        <p>
          <Link to="/privacy-policy" style={{ color: "#ddd" }}>
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link to="/terms-of-service" style={{ color: "#ddd" }}>
            Terms of Service
          </Link>
        </p>
      </footer>
    </div>
  );
}

// ServiceCard Component for Reusability
function ServiceCard({ id, title, location, languages, pricePerHour }) {
  return (
    <div className="service">
      <h3>{title}</h3>
      <p>
        <strong>Location:</strong> {location}
      </p>
      <p>
        <strong>Languages:</strong> {languages?.join(", ")}
      </p>
      <p>
        <strong>Price per Hour:</strong> ${pricePerHour}
      </p>
      <Link to={`/services/${id}`} className="view-details-button">
        View More Details
      </Link>
    </div>
  );
}

export default HomePage;