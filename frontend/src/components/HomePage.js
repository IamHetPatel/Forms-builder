import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/HomePage.css";
import Navbar from "./NavigationBar";
const HomePage = ({ user }) => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchForms();
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  const fetchForms = async () => {
    try {
      const userId = user._id;
      const response = await fetch(
        `https://gray-rich-dragonfly.cyclic.app/api/forms/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch forms");
      }
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="home-container">
        <h2>Welcome, {user.username}!</h2>
        <div className="form-buttons">
          {forms.map((form) => (
            <div key={form._id} className="form-button">
              <Link to={`/form/${form._id}/preview`} className="big-button">
                Preview Form: {form.title}
              </Link>
              <Link to={`/form/${form._id}/responses`} className="big-button">
                View Responses: {form.title}
              </Link>
            </div>
          ))}
          <Link to="/buildform" className="big-button-2">
            Create New Form
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
