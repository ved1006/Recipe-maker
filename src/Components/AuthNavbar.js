import React from "react";
import { Link } from "react-router-dom";
import "./Auth/auth.css";

function AuthNavbar() {
  return (
    <nav className="auth-navbar">
      <div className="logo">Cooksy</div>
      <ul className="auth-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        
      </ul>
    </nav>
  );
}

export default AuthNavbar;
