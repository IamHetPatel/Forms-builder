import React from 'react';

const HomePage = ({ user }) => {
  return (
    <div className="home-container">
      <h2>Welcome, {user.username}!</h2>
      <p>This is the home page of the application. You can start by creating forms or exploring other features.</p>
    </div>
  );
};

export default HomePage;
