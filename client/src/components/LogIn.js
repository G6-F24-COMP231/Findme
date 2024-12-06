import React, { useRef, useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../UserContext';
import emailjs from '@emailjs/browser';
import Modal from 'react-modal';
import "./popup.css"; 


/**
 * Login component for user authentication.
 * Allows the user to login using their username and password. After successful login,
 * the user will receive an OTP via email to confirm the login.
 * 
 * @returns {JSX.Element} The Login component.
 */
const Login = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);  // State to control OTP popup visibility
  const [inputValue, setInputValue] = useState("");  // OTP input value
  const [message, setMessage] = useState('');  // Response message
  const [errors, setErrors] = useState({});  // Validation errors
  const { setUser } = useContext(UserContext);  // Access user context to update user data
  const [email, setEmail] = useState("");  // User email
  const [username, setUsername] = useState("");  // User username
  
  const navigate = useNavigate();  // Navigation hook to redirect after login
 

  // UseEffect hook to send email after email and username are updated
  useEffect(() => {
    if (email && username) {
      sendEmail();  // Send the email once the email and username are set
      handleOpenPopup();
    }
  }, [email, username]);


  /**
   * Validates the login form to ensure the username and password are provided.
   * Ensures password is at least 6 characters long.
   * 
   * @returns {boolean} Returns true if form is valid, otherwise false.
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  /**
   * Sends an email notification using EmailJS when the user logs in.
   * 
   * @param {Event} e - The form submission event.
   */
  const sendEmail = () => {
    //e.preventDefault();
    console.log(email);
    console.log(username);
    const templateParams = {
      
      email: email,
      username: username
      
    };

    emailjs
      .send('service_qw4tqsp', 'template_j5xmruk', templateParams, {
        publicKey: 'zomtsQF384EML4F90',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          
        },
        (error) => {
          console.log('FAILED...', error.text);
          
        },
      );
  };

  /**
   * Handles changes to the form input fields.
   * 
   * @param {Event} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  /**
   * Opens the OTP popup modal.
   */
  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };


  /**
   * Closes the OTP popup modal.
   */
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };


  /**
   * Submits the OTP entered by the user. If the OTP is correct, navigates to the home page.
   * 
   * @param {Event} e - The submit event.
   */
  const handleSubmit = () => {
    if(inputValue === "398451")
    {
      alert('OTP Matched')
      setIsPopupOpen(false); 
      navigate('/');
    }
    else{
      alert('Invalid OTP');
    }
    
  };


   /**
   * Handles the form submission for login.
   * If the form is valid, sends a request to the backend to authenticate the user.
   * If the login is successful, sends an OTP email and opens the OTP popup.
   * 
   * @param {Event} e - The form submission event.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('https://findme-1-77d9.onrender.com/api/users/login', { 
          username: formData.username,
          password: formData.password
           });
        console.log(response.data.user.email);
        setEmail(response.data.user.email);
        
        setUsername(response.data.user.username);
        setMessage(response.data.message);
        setUser(response.data.user);  // Update user context
        
        
        
      } catch (error) {
          console.log(error);
          setMessage(error.response.data.message || 'Error logging in');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h3>Login</h3>
      <form ref={form} onSubmit={handleLogin} className="login-form">
        <div style={styles.formGroup}>
          
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            style={styles.input}
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p style={styles.error}>{errors.username}</p>}
        </div>

        <div style={styles.formGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            style={styles.input}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>

        <button type="submit" style={styles.button}>
          Login
        </button>
        <Modal isOpen={isPopupOpen} onRequestClose={handleClosePopup}>
          <div className="popup-overlay">
            <div className="popup-content">
          <h2>Please enter the OTP sent to your Email:</h2>
          <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <div className="popup-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleClosePopup}>Cancel</button>
          </div>
            
          
            </div>
          </div>
        </Modal>
      </form>
      <p style={styles.signupText}>
        Don’t have an account? <a href="/signup">Sign Up</a>
      </p>
      {message && <div style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</div>}
    </div>
    
  );
};

const styles = {
  container: {
    width: "100%",
    maxWidth: "550px",
    margin: "0 auto",
    marginTop: "30px",
    marginBottom: "40px",
    padding: "20px",
    textAlign: "center",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
    boxSizing: "border-box",
  },
  formGroup: {
    marginBottom: "20px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "8px",
    marginBottom: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  signupText: {
    marginTop: "20px",
    fontSize: "14px",
  },
};

export default Login;
