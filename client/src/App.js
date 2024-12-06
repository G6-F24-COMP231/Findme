import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router components
import Signup from "./components/Signup";
import HomePage from "./components/Homepage1";
import SearchResultsPage from "./components/SearchResultsPage";
import Login from "./components/LogIn";
import ServiceDetailsPage from "./components/ServiceDetailsPage";
import UserProfile from "./components/UserProfile";
import ListOfServices from "./components/ListOfServices";
import AddServicePage from "./components/AddServicePage";
import UserReviewForm from "./components/ReviewForm";
import BookingsPage from "./components/BookingsPage"
import CancellationForm from "./components/CancellationForm"
import PaymentSuccess from "./components/PaymentSuccess";
import Contact from "./components/Contact";

/**
 * Main Application component that manages routing.
 * All route definitions are listed here.
 */
const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="**" element={<HomePage />} />
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/search-results" element={<SearchResultsPage />} />
        <Route exact path="/ListOfServices" element={<ListOfServices />} />
        <Route exact path="/add-service" element={<AddServicePage />} />
        <Route exact path="/services/:serviceId" element={<ServiceDetailsPage />} />
        <Route exact path="/profile" element={<UserProfile />} />
        <Route exact path="/success" element={<PaymentSuccess />} />
        <Route exact path="/review" element={<UserReviewForm />} />
        <Route exact path="/bookings" element={<BookingsPage />} />
        <Route exact path="/cancel/:bookingId" element={<CancellationForm />} />
        <Route exact path="/contact" element={< Contact />} />
      </Routes>
    </Router>
  );
};

export default App;
