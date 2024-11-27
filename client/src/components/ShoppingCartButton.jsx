import React, { useState } from 'react';
import '../css/ShoppingCartButton.css'; // Import the CSS
import { Link } from 'react-router-dom';

export default function ShoppingCart() {
    const cart = JSON.parse(localStorage.getItem('shoppingCart'));
    if(!cart){
        return null;
    }
return(

    <Link to ="/shoppingCart" className='button-followsyou'>🛍️</Link>

)
}


