import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css'; 
import SignUpButton from './SignUpButton';
import LoginButton from './LoginButton';
import { useNavigate } from 'react-router-dom';


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);


  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const userObj = JSON.parse(user);
  const fullname = userObj?.givenName?.split(' ')[0];

  const handleMouseEnter = () => setIsMenuVisible(true);
  const handleMouseLeave = () => setIsMenuVisible(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > lastScrollTop) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      setLastScrollTop(scrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('shoppingCart');
    setIsLoggedIn(false);
    navigate('/');
  };

  useEffect(() => {
    const getUserWithExpiry = () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return false; 
      }
      const foundUser = JSON.parse(userStr);
      const now = new Date();
      if (now.getTime() > foundUser.expiry) {
        localStorage.removeItem('user');
        localStorage.removeItem('shoppingCart');
        return false; 
      }
      return true;
    };

    setIsLoggedIn(getUserWithExpiry());

    const intervalId = setInterval(() => {
      setIsLoggedIn(getUserWithExpiry());
    }, 1000);
  }, []);

  // console.log(userObj)
  return (
    <nav className={isScrolled ? 'navbar scrolled' : 'navbar'}>
      <div className="navbarleft">
        <h2 className="brand">Galang Glass & Aluminum</h2>
        <Link to="/" className='link'>Home</Link>
        <Link to="/products" className='link'>Products</Link>
        <Link to="/request-quotation" className='link'>Request Quotation</Link>
        {userObj?.isAdmin && <Link to="/inventory" className='link'>Admin</Link>}
      </div>
      <div className="navbarright">
        {isLoggedIn ? (
          <div className='signedin' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <h3>Hi, {fullname}!</h3>
            <img src={userObj.picture} className="navpfp" alt="pfp"/>
            {isMenuVisible && (
              <div className="collapsible-menu">
                <Link to="/profile" className='link'>Profile</Link>
                <Link to="/client-order" className='link'>Orders</Link>
                <Link to ="/shoppingCart" className='link'>Shopping Cart</Link>
                <Link to="/" onClick={handleLogout}className='link'>Logout</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <SignUpButton />
            <LoginButton />
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;