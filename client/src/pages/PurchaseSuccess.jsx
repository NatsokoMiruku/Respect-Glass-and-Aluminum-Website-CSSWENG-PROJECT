import {useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import '../css/PurchaseSuccess.css';

const SuccessfulPurchase = () => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [users, setUser] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    const payerId = urlParams.get('PayerID');
    const userId = urlParams.get('userId');
    const total = urlParams.get('total');
    const shippingAddress = {
      street: urlParams.get('street'),
      city: urlParams.get('city'),
      province: urlParams.get('province'),
      zip: urlParams.get('zip'),
      country: urlParams.get('country')
    };

    if (!paymentId || !payerId) {
      console.error('Missing paymentId or payerId');
      return;
    }

    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      setShoppingCart(JSON.parse(storedCart));
    }

    fetch(`/api/success?paymentId=${paymentId}&PayerID=${payerId}&userId=${userId}&total=${total}&street=${shippingAddress.street}&city=${shippingAddress.city}&province=${shippingAddress.province}&zip=${shippingAddress.zip}&country=${shippingAddress.country}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(async (data) => {
      
      let prodData

      try{ 
        const res = await fetch("/api/inventory");
        prodData = await res.json();
        
        if (Array.isArray(prodData)){ //remove if does not work
          setUser(prodData);
        } else {
          console.log("Fetched Inventory is not an array");
        }
        
      } catch (err){
        console.error("Failed to fetch inventory", err);
        success = false
      }
      
      let success = true
      JSON.parse(storedCart).map(async (item) => {
        let itemData = prodData.find(product => {
          return product._id === item.productId;
        })
        if(success == true && itemData != undefined){
            await fetch("api/inventory/" + item.productId,{ //edit me later
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
              body: JSON.stringify({ 
                  qty: itemData.qty - item.quantity,
                  remaining: itemData.remaining - item.quantity,
              })
            });
        }
      })

      if (success == true){
        console.log('Success:', data);

        const orderDetails = {
          items: JSON.parse(storedCart).map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          totalPrice: total,
          qty: JSON.parse(storedCart).reduce((acc, item) => acc + item.quantity, 0),
          recipient: userId,
          shippingAddress,
          status: 'Pending'
        };

        return fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderDetails)
        });
      }
    })
    .then(orderResponse => {
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      localStorage.removeItem("shoppingCart");
      return orderResponse.json();
    })
    .then(orderData => {
      console.log('Order created successfully:', orderData);
      localStorage.removeItem("shoppingCart");
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="successful-purchase-container">
        <h1>Purchase Successful!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <p>You will receive a confirmation email with your order details shortly.</p>
        <a href="/products" className="continue-shopping-link">Continue Shopping</a>
      </div>
    </>
  );
};


export default SuccessfulPurchase;

