import React, { useRef, useState } from "react";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../UserContext';
// import emailjs from "@emailjs/browser";

const Login = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

   const navigate = useNavigate();

  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState({});

  const { setUser } = useContext(UserContext);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:5001/api/login', { 
          username: formData.username,
          password: formData.password
           });
        setMessage(response.data.message);
        setUser(response.data.user);
        
        console.log(response.data.user)
        navigate('/');
      } catch (error) {
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
