// SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';  // Import ServiceCard component
import '../styles/SearchResultsPage.css';
import { useContext } from 'react';
import { UserContext } from './../UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';


/**
 * SearchResultsPage Component
 *
 * This component displays the results of a search query for services, with filters for price and date. 
 * It fetches and displays service data based on the search query and applies filters to the results.
 *
 * @returns {JSX.Element} The rendered search results page.
 */
function SearchResultsPage() {
  const [results, setResults] = useState([]); // State to hold the search results
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [query, setQuery] = useState(''); // State to hold the search query
  const [maxPrice, setMaxPrice] = useState(''); // State to hold the maximum price filter
  const [selectedDate, setSelectedDate] = useState(""); // State to hold the selected date for filtering
  const location = useLocation(); // Hook to access the location object
  const navigate = useNavigate(); // Hook to navigate between pages
  const { user } = useContext(UserContext); // Accessing the current logged-in user from context
  const [showFilter, setShowFilter] = useState(false); // State to control the visibility of the filter options


  /**
   * UseEffect hook to initialize the search query from the URL and fetch the results
   */
  useEffect(() => {
    const initialQuery = new URLSearchParams(location.search).get('q');
    if (initialQuery) {
      setQuery(initialQuery);
      fetchResults(initialQuery, maxPrice, selectedDate); // Fetch results when query changes
    }
  }, [location.search]);


  /**
   * Fetches search results from the backend API based on the provided filters.
   * 
   * @param {string} searchQuery - The search query entered by the user.
   * @param {string} priceFilter - The maximum price filter.
   * @param {string} sDate - The selected date for filtering the results.
   */
  const fetchResults = async (searchQuery, priceFilter, sDate) => {
    setLoading(true);
    try {
      const url = new URL('https://findme-1-77d9.onrender.com/api/services/search');
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (priceFilter) params.set('maxPrice', priceFilter);// Set the price filter if provided
      console.log(sDate);
      if (sDate) 
        {
          const date = new Date(sDate);


          const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"];
          const day = days[date.getDay()];
          console.log(day);
          params.set('selectedDay', day);
        }

      url.search = params.toString();

      const response = await fetch(url);
      const data = await response.json();
      
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };


  /**
   * Handles the form submission for the search query and filters.
   */
  const handleSearchSubmit = () => {
    // Navigate to the search results page with query parameters
    navigate(`/search-results?q=${query}&maxPrice=${maxPrice}&selectedDate=${selectedDate}`);
    fetchResults(query, maxPrice, selectedDate);
  };

  return (
    <div className="search-results-page">
      <header>
        <h1>Find Me</h1>
        <p>Explore thousands of services available near you!</p>
      </header>
     

      <nav>
        <Link to="/">Home</Link>
        <Link to="/listofservices">Find Talent</Link>
        <Link to="/contact">Contact</Link>
        {user ? (
          <>
            <Link title="Click to show profile" to="/profile">Welcome { user?.username }</Link>
            <Link to="/add-service" className="add-service-link">Add Service</Link>
            <Link to="/bookings">Bookings</Link>
          </> )
           : (
            <>
            <Link to="/signup">Sign Up</Link>
          <Link to="/login">Login</Link>
            </>
           )}
        
      </nav>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search jobs by keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        
          <button type="button" onClick={handleSearchSubmit}>
            Search
          </button>

          {/* Filter Button (with Font Awesome filter icon) */}
          <button type="button" onClick={() => setShowFilter(!showFilter)}>
            <FontAwesomeIcon icon={faFilter} /> {/* Filter settings icon */}
          </button>
        </div>

        {/* Filter Options */}
        {showFilter && (
          <div className="filter-options">
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              <option value="">Max Price</option>
              <option value="25">25/hour</option>
              <option value="35">35/hour</option>
              <option value="45">45/hour</option>
              <option value="60">60/hour</option>
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

              <input type="text" placeholder="Enter location" />
          </div>
        )}

      <div className="body_container">
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          <div className="service-list">
            {results.map((result) => (
              console.log(result._id),
              <ServiceCard
                key={result._id}
                id={result._id}
                
                title={result.serviceName}
                location={result.location}
                languages={result.languages}
                pricePerHour={result.price}
              />
            ))}
          </div>
        ) : (
          <p style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>No results found</p>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;
