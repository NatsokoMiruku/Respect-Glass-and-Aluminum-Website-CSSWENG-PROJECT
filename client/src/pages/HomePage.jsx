import React from 'react';
import Navbar from '../components/Navbar';
import '../css/HomePage.css'; 
import GetStarted from '../components/GetStarted';
import ImageSlider from '../components/ImageSlider';
import ShoppingCart from '../components/ShoppingCartButton';

function HomePage() {
  const products = ['/images/p1.png','/images/p2.png' ,'/images/p3.png'];

  return (
    <>
    <Navbar />  
    <ShoppingCart/>
    <div className="homePage">
      <div className="hero1">
          <h1>Glass and Aluminum products</h1>
          <p>Your source for high-quality glass and aluminum products</p>
          <GetStarted />
      </div>
      <div className="hero2">
          <ImageSlider slides={products} />
      </div>
      <div className="hero3">
          <h1>Our Products</h1>
          <p>Check out our wide range of products</p>
        <div className="images">
          <div className="product1">
            <div className='product1image' />
            <h3>Bronze Mirror</h3>
            <h5>₱80/inch</h5>
          </div>
          <div className="product2">
            <div className='product2image' />
            <h3>Copper Free Mirror</h3>
            <h5>₱90/inch</h5>
          </div>
          <div className="product3">
            <div className='product3image' />
            <h3>Regular Mirror</h3>
            <h5>₱70/inch</h5>
          </div>
        </div>
      </div>
      
      <div className="contactus">
        <h1>Contact Us</h1>

        <div className="text">
          <p>Our professionals would be able to help and answer your inquiries.</p>
          <p>Through the channels below, we will be able to assist you in any way we can.</p>
          <p>Below is also the location of our main office, feel free to visit and inqure in person.</p>
        </div>
      </div>

      <div className='hero4'>
        <div className='hero4left'>
          <div className="location">
            <h2>Location</h2>
            <p> 076 tampus Boac </p>
            <p>Marinduque, Philippines</p>
            <p>(+63) 966-997-3990</p>
          </div>
        </div>

        <div className="hero4right">
          <iframe width= "90%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=2401%20Taft%20Ave,%20Malate,%20Manila,%201004%20Metro%20Manila+(De%20La%20Salle%20University%20Manila)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
          <a href="https://www.gps.ie/">gps systems</a></iframe>
        </div>

      </div>    
  
      

        <div className="footer">
          <p>Monday - Saturday</p>
          <p>(+63) 966-997-3990</p>
          <p>respectglassandaluminum@gmail.com</p>
        </div>
      </div>
    </>

  );
}

export default HomePage;