
import React from 'react';
import '../css/ErrorPage.css'; 

const ErrorPage = () => {
  return (
    <div className="error-page">
      <h1 className="error-code">404</h1>
      <h2 className="error-message">Page Not Found</h2>
      <p className="error-description">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="home-link">Go back to Home</a>
    </div>
  );
};

export default ErrorPage;
