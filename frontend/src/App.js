import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import statement
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./components/HomePage";
import FormBuilderPage from "./components/FormBuilderPage";
import FormSubmissionPage from "./components/FormSubmissionPage";
import FormResponsesPage from "./components/FormResponsesPage";
import UserProfilePage from "./components/UserProfilePage";
import FormPreviewPage from "./components/FormPreviewPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // Assuming the decoded token has user info
      } catch (error) {
        console.error("Error decoding token: ", error);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={user ? <HomePage user={user} handleLogout={handleLogout} /> : <Navigate to="/signin" />} />
          <Route path="/signin" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/buildform"
            element={
              user ? (
                <FormBuilderPage user={user} handleLogout={handleLogout} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route path="/fillform/:formId" element={<FormSubmissionPage />} />
          <Route
            path="/form/:formId/preview"
            element={
              user ? (
                <FormPreviewPage user={user} handleLogout={handleLogout} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="form/:formId/responses"
            element={
              user ? (
                <FormResponsesPage user={user} handleLogout={handleLogout} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <UserProfilePage user={user} handleLogout={handleLogout} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
