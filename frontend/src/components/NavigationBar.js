
import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';


const NavigationBar = ({ handleLogout }) => {
  return (
    <div className="navbar-container">
      <div className="navbar-item">
        <NavLink exact to="/" className="navbar-link" activeClassName="active-link">Home</NavLink>
      </div>
      <div className="navbar-item">
        <NavLink to="/profile" className="navbar-link" activeClassName="active-link">Profile</NavLink>
      </div>
      <div className="navbar-item">
        <NavLink to="/buildform" className="navbar-link" activeClassName="active-link">Create Form</NavLink>
      </div>
      <div className="navbar-item">
        <button className="logout" onClick={handleLogout}>
            <NavLink to="/signin" className="logout-link">Logout</NavLink>
        </button>
      </div>
    </div>
  );
}

export default NavigationBar;

