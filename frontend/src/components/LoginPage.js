import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/loginpage.css";
const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data); // Log response from backend (e.g., success message or error)
      if (response.ok) {
        sessionStorage.setItem("token", data.token);
        navigate("/"); // Redirect to homepage after successful login
      }
      // Reset form fields if login is successful
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle error (e.g., show error message to the user)
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;