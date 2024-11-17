import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/Homepage1";
import Signup from "./components/Signup";
import Login from "./components/LogIn";
import SearchResultsPage from "./components/SearchResultsPage";
import ListOfServices from "./components/ListOfServices";
import ServiceDetailsPage from "./components/ServiceDetailsPage";
import UserProfile from "./components/UserProfile";
import { AuthProvider } from "./context/AuthContext"; // Make sure this path is correct

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/search-results" element={<SearchResultsPage />} />
          <Route exact path="/listofservices" element={<ListOfServices />} />
          <Route exact path="/services/:serviceId" element={<ServiceDetailsPage />} />
          <Route exact path="/profile" element={<UserProfile />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;