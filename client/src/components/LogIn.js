import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Make sure this path is correct

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
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
        const response = await fetch("http://localhost:5001/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          login(data); // Update AuthContext
          navigate("/"); // Redirect to home page
        } else {
          const errorData = await response.json();
          setErrors({ form: errorData.message });
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({ form: "An error occurred during login." });
      }
    }
  };

  return (
    <div style={styles.container}>
      <h3>Login</h3>
      <form onSubmit={handleLogin} className="login-form">
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

        {errors.form && <p style={styles.error}>{errors.form}</p>}

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <p style={styles.signupText}>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
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
