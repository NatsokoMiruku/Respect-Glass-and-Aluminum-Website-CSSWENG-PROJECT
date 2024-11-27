import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

function GetStarted() {
  return (
    <Link to="/products" className="GetStarted">
        Get Started
    </Link>
  );
}

export default GetStarted;
