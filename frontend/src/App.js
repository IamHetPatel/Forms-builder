import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./components/HomePage";

function App() {
  const [user, setUser] = useState(null); // Initial user state

  useEffect(() => {
    // Check if there is a token in sessionStorage
    const token = sessionStorage.getItem("token");
    if (token) {
      // Decode the token to get user details
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("token");
  };

  return (
    <Router>
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <HomePage user={user} handleLogout={handleLogout} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route path="/signin" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
