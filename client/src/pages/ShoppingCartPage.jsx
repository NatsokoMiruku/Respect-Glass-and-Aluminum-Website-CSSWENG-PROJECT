import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../css/ShoppingCart.css';
import {useNavigate} from 'react-router-dom'

const ShoppingCart = () => {
    const [cart, setCart] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const getProducts = async () => {
        try {
            const res = await fetch("/api/inventory");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.log("Fetched Inventory is not an array");
            }
        } catch (err) {
            console.error("Failed to fetch inventory", err);
        }
    };

    useEffect(() => {
        const shoppingCart = localStorage.getItem('shoppingCart');
        if (shoppingCart) {
            setCart(JSON.parse(shoppingCart));
        } else {
            localStorage.setItem('shoppingCart', JSON.stringify([]));
            setCart(JSON.parse(localStorage.getItem('shoppingCart')));
        }
        getProducts();
    }, []);

    const deleteCart = (e) => {
        e.preventDefault();
        localStorage.removeItem('shoppingCart');
        setCart([]);
    }

    const deleteItem = (key) => {
        const updatedCart = cart.filter(item => item.productId !== key);
        localStorage.setItem('shoppingCart', JSON.stringify(updatedCart));
        setCart(updatedCart);
    }

    const proceedToPayment = () => {
        navigate('/submit-order');
    };

    return (
        <>
            <Navbar />
            <br></br>
                <br></br>
                <br></br>
                <br></br>

            <div className="shopping-cart-container">
                {/* <h1>Shopping Cart:</h1> */}
                
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map(item => {
                            const product = products.find(p => p._id === item.productId);
                            if (!product) {
                                console.error(`Product with ID ${item.productId} not found in products array`);
                                return (
                                    <tr key={item.productId}>
                                        <td colSpan="5">Product not found - Quantity: {item.quantity}</td>
                                    </tr>
                                );
                            }
                            return (
                                <tr key={item.productId}>
                                    <td>{product.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>Php {product.price}</td>
                                    <td>Php {product.price * item.quantity}</td>
                                    <td>
                                        <button onClick={() => deleteItem(item.productId)}>Discard Item</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="cart-actions">
                    <form onSubmit={deleteCart}>
                        <button type="submit" className="discard-cart-button">Discard Cart</button>
                    </form>
                    <form>
                        <button onClick={proceedToPayment} className="proceed-button">Proceed to Payment</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ShoppingCart;
