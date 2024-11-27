import React from 'react';
import Navbar from '../components/Navbar';
import '../css/PurchaseCancel.css'; 

const PurchaseCancelled = () => {
  return (
    <>
      <Navbar />
      <div className="purchase-cancelled-container">
        <h1>Purchase Cancelled</h1>
        <p>Your purchase has been cancelled. If you have any questions, please contact our support team.</p>
        <p>We hope to see you again soon.</p>
        <a href="/products" className="continue-shopping-link">Continue Shopping</a>
      </div>
    </>
  );
};

export default PurchaseCancelled;
