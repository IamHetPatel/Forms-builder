import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

const UserProfilePage = ({ user, handleLogout }) => {
  const navigate = useNavigate();
  const [userDet, setUserDet] = useState({
    username: user.username,
    email: user.email,
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(
        "https://gray-rich-dragonfly.cyclic.app/api/user/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token here as well
          },
          body: JSON.stringify(userDet),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user profile");
      }
      const responseData = await response.json();
      setUserDet(responseData.userDet);
      navigate("/profile"); // Redirect to profile page after successful update
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleUpdateProfileTemp = async (e) => {
    e.preventDefault();
    alert("to be implemented");
  };

  return (
    <div>
      <NavigationBar user={user} handleLogout={handleLogout} />
      <div className="user-profile-container">
        <h2>User Profile</h2>
        <form onSubmit={handleUpdateProfileTemp}>
          <label>Name:</label>
          <input
            type="text"
            value={userDet.username}
            onChange={(e) =>
              setUserDet({ ...userDet, username: e.target.value })
            }
          />

          <label>Email:</label>
          <input
            type="email"
            value={userDet.email}
            onChange={(e) => setUserDet({ ...userDet, email: e.target.value })}
          />

          <label>Password:</label>
          <input
            type="password"
            value={userDet.password}
            onChange={(e) =>
              setUserDet({ ...userDet, password: e.target.value })
            }
          />

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
