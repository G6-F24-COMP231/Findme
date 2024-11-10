import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Router components
import Signup from './components/Signup';
import HomePage from './components/Homepage1'; 
import SearchResultsPage from './components/SearchResultsPage'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<HomePage />}/>
        <Route exact path="/signup" element={<Signup />} />  {/* Make Signup the default route */}
        <Route exact path='/search-results' element={<SearchResultsPage />}/>
      </Routes>
    </Router>
  );
};

export default App;
