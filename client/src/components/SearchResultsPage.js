// SearchResultsPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResultsPage.css';

function SearchResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  

  // Extract query parameter from URL
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (query) => {
    setLoading(true);
    try {
    //here is where the API for the data base will be
      const response = await fetch(`http://localhost:5000/api/search?q=${query}`); 
      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-results-page">
      <header>
        <h1>Find Me</h1>
        <p>Explore thousands of services available near you!</p>
      </header>

      <nav>
        <a href="/">Home</a>
        <a href="#">Why Find Me</a>
        <a href="#">Find Talent</a>
        
        <a href="#">Contact</a>
        <a href="/signup">Login/Sign Up</a>
      </nav>

       {/* Search Bar */}
       <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs by keyword"
            value={query}
            // onChange={(e) => setQuery(e.target.value)}
          />
          <select>
            <option value="">Filter</option>
            <option value="option">#Option#</option>
          </select>
          <button type="button" onClick={handleSearch}>Search</button>
        </div>



      <div className="results-container">
        {loading ? (
          <p>Loading...</p>
        ) : results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} className="result-item">
              <h3>{result.serviceName}</h3>
              <p>{result.location}</p>
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>

    </div>
  );
}

export default SearchResultsPage;
