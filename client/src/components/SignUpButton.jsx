import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

function SignUpButton() {
  return (
    <Link to="/signup" className="signUpButton">
      Sign Up
    </Link>
  );
}

export default SignUpButton;