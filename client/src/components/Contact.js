import React from "react";
import "../styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-container">
      <header>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Feel free to reach out through any of the methods below.</p>
      </header>

      <section className="contact-info">
        <h2>Our Contact Details</h2>
        <ul>
          <li><strong>Email:</strong> support@findme.com</li>
          <li><strong>Phone:</strong> +1 (123) 456-7890</li>
          <li><strong>Address:</strong> 123 FindMe Lane, Toronto, ON, Canada</li>
        </ul>
      </section>

      <section className="contact-form">
        <h2>Send Us a Message</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" placeholder="Write your message here" required></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </section>

      <footer>
        <p>&copy; 2024 Find Me. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
