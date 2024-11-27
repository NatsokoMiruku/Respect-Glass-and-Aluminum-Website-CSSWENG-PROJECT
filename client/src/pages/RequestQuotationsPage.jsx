import React, { useState, useEffect } from 'react';
import '../css/RequestQuotationsPage.css';
import Navbar from '../components/Navbar';
import ShoppingCart from '../components/ShoppingCartButton';

const RequestQuotationsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    description: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await fetch('/api/request-quotation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Request submitted successfully');
        setFormData({
          name: '',
          email: '',
          contact: '',
          description: '',
        });
      } else {
        alert('Error submitting request');
      }
    } catch (error) {
      alert('Error submitting request');
    }
  };

  return (
    <>
      <Navbar />
      <ShoppingCart/>
      <div className="background">
        <div className="page-container">
          <div className="heading-container">
            <h2>Feel free to leave a request!</h2>
            <p>We ensure high quality service and fast responses</p>
            <p>so that the customer can request and rely on our services more.</p>
          </div>
          {isLoggedIn ? (
            <div className={`form-container ${isLoaded ? 'loaded' : ''}`}>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Name:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <label>Email:</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                  <label>Contact:</label>
                  <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required />
                </div>
                <button type="submit">Submit</button>
              </form>
              <div className={`side-image ${isLoaded ? 'loaded' : ''}`}></div>
            </div>
          ) : (
            <h1>You must be logged in to submit a request</h1>
          )}
        </div>
        <div className="footer">
          <p>Monday - Saturday</p>
          <p>(+63) 966-997-3990</p>
          <p>respectglassandaluminum@gmail.com</p>
        </div>
      </div>
    </>
  );
};

export default RequestQuotationsPage;
