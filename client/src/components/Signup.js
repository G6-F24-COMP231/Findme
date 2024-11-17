import React, { useRef, useState, useContext  } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import emailjs from "@emailjs/browser";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const form = useRef();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    userType: "",
    serviceType: "",
    serviceName: "",
    location: "",
    resume: null,
    availableDays: [],
    startTime: "",
    endTime: "",
    price: "",
    languages: [],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.mobileNumber) newErrors.mobileNumber = "Mobile number is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, resume: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      availableDays: checked ? [...prev.availableDays, value] : prev.availableDays.filter((day) => day !== value),
    }));
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    console.log("inside sendEmail");
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5001/api/users/signup', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          alert("Signup successful!");
          
          // Automatically log in the user
          const loginResponse = await fetch('http://localhost:5001/api/users/login', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: formData.username,
              password: formData.password,
            }),
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            login(loginData); // Update AuthContext
            navigate("/"); // Redirect to home page
          } else {
            console.error("Auto-login failed after signup");
          }

          emailjs
            .sendForm("service_debeiyt", "template_4wzuql7", form.current, {
              publicKey: "9B_G4UOwgNSsEHZiJ",
            })
            .then(
              () => {
                console.log("SUCCESS!");
                alert("Email sent successfully!");
              },
              (error) => {
                console.log("FAILED...", error.text);
                alert("Email confirmation Failed...", error.text);
              }
            );

          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            mobileNumber: "",
            userType: "",
            serviceType: "",
            serviceName: "",
            location: "",
            resume: null,
            availableDays: [],
            startTime: "",
            endTime: "",
            price: "",
            languages: [],
          });
        } else {
          alert("Failed to sign up");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred during signup.");
      }
    }
  };


  return (
    <div style={styles.container}>
      <h3>Sign Up</h3>
      <form ref={form} onSubmit={sendEmail} className="signup-form">
        <div style={styles.formGroup}>
          <label>Username</label>
          <input type="text" name="username" placeholder="Enter your username" style={styles.input} value={formData.username} onChange={handleChange} />
          {errors.username && <p style={styles.error}>{errors.username}</p>}
        </div>

        <div style={styles.formGroup}>
          <label>Email Address</label>
          <input type="email" name="email" placeholder="Enter your email" style={styles.input} value={formData.email} onChange={handleChange} />
          {errors.email && <p style={styles.error}>{errors.email}</p>}
        </div>

        <div style={styles.formGroup}>
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            placeholder="Enter mobile number"
            style={styles.input}
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[\d\+\-\(\)\s]*"
            title="Only digits and symbols (+, -, (, )) are allowed."
          />
          {errors.mobileNumber && <p style={styles.error}>{errors.mobileNumber}</p>}
        </div>

        {/* User Type Radio Buttons */}
        <div style={styles.formGroup}>
          <label>User Type</label>
          <div style={styles.radioGroup}>
            <label>
              <input type="radio" name="userType" value="ServiceProvider" onChange={handleChange} checked={formData.userType === "ServiceProvider"} />
              Service Provider
            </label>
            <label>
              <input type="radio" name="userType" value="ServiceSeeker" onChange={handleChange} checked={formData.userType === "ServiceSeeker"} />
              Service Seeker
            </label>
          </div>
        </div>

        {formData.userType === "ServiceProvider" && (
          <>
            <div style={styles.formGroup}>
              <label>Service Type</label>
              <select name="serviceType" style={styles.input} value={formData.serviceType} onChange={handleChange}>
                <option value="">Select Service Type</option>
                <option value="Full-time worker">Full-time worker</option>
                <option value="Part-time worker">Part-time worker</option>
                <option value="Freelancer">Freelancer</option>
                <option value="Small Business">Small Business</option>
                <option value="Company Administrator">Company Administrator</option>
                <option value="Student">Student</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Service Name</label>
              <input type="text" name="serviceName" placeholder="Enter service name" style={styles.input} value={formData.serviceName} onChange={handleChange} />
            </div>

            <div style={styles.formGroup}>
              <label>Location</label>
              <select name="location" style={styles.input} value={formData.location} onChange={handleChange}>
                <option value="">Select Location</option>
                <option value="Toronto">Toronto</option>
                <option value="Vancouver">Vancouver</option>
                <option value="Montreal">Montreal</option>
                <option value="Calgary">Calgary</option>
                <option value="Edmonton">Edmonton</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Upload Resume</label>
              <input type="file" name="resume" style={styles.input} onChange={handleFileChange} />
            </div>

            {/* Available Days */}
            <div style={styles.formGroup}>
              <label>Available Days</label>
              <div style={styles.checkboxGroup}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <label key={day}>
                    <input type="checkbox" name="availableDays" value={day} checked={formData.availableDays.includes(day)} onChange={handleCheckboxChange} />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            {/* Time Range Field */}
            <div style={styles.formGroup}>
              <label>Available Time</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input type="time" name="startTime" style={styles.input} value={formData.startTime} onChange={handleChange} placeholder="From" />
                <input type="time" name="endTime" style={styles.input} value={formData.endTime} onChange={handleChange} placeholder="To" />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label>Price (CAD)</label>
              <input type="number" name="price" placeholder="Enter price in CAD" style={styles.input} value={formData.price} onChange={handleChange} />
            </div>

            <div style={styles.formGroup}>
              <label>Languages</label>
              <select
                name="languages"
                style={styles.input}
                value={formData.languages}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    languages: [...e.target.selectedOptions].map((o) => o.value),
                  })
                }
                multiple>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="Mandarin">Mandarin</option>
              </select>
            </div>
          </>
        )}

        <div style={styles.formGroup}>
          <label>Password</label>
          <input type="password" name="password" placeholder="Enter your password" style={styles.input} value={formData.password} onChange={handleChange} />
          {errors.password && <p style={styles.error}>{errors.password}</p>}
        </div>

        <div style={styles.formGroup}>
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" placeholder="Confirm your password" style={styles.input} value={formData.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
        </div>

        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "0 auto",
  },
  formGroup: {
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    boxSizing: "border-box",
  },
  radioGroup: {
    display: "flex",
    gap: "10px",
  },
  checkboxGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  error: {
    color: "red",
    fontSize: "12px",
    marginTop: "5px",
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default Signup;
