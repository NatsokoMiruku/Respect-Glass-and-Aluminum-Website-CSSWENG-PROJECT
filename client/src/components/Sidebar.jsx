import React, { useState } from 'react';
import '../css/Sidebar.css'; // Import the CSS
import { json } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = localStorage.getItem("user")
  const userObj = JSON.parse(user);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar-container">
      <div className={`sidenav ${isOpen ? 'show' : 'closed'}`}>
        <div className="sidebar-header">
          <img src={userObj.picture} className="admin-picture" alt="pfp"/>
          <h2 className="greeting">Welcome back, Admin!</h2>
        </div>
        <a href="/inventory">Inventory</a>
        <a href="/admin-quotation">Quotations</a>
        <a href="/adminOrders">Orders</a>
        {/* <a href="/placeholder">Placeholder</a> */}
      </div>

      <button className={`sidebar-toggle ${isOpen ? 'show' : 'closed'}`} onClick={toggleSidebar}>
        SIDEBAR
      </button>
    
    </div>
  );
}

export default Sidebar;