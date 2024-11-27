import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

function LoginButton() {
  return (
    <Link to="/login" className="LoginButton">
      Login
    </Link>
  );
}

export default LoginButton;
