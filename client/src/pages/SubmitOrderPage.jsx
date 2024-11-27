import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import '../css/SubmitOrderPage.css';

function SubmitOrder() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({});
    const [user, setUser] = useState(null);
    
    const getUser = async() => {
        try{
            const user = JSON.parse(localStorage.getItem('user')); 
            console.log('user', user.id);
            const res = await fetch(`/api/user?userId=${user.id}`);
            const data = await res.json();
            setUser(user);
            setShippingAddress(data.shippingAddress);
            console.log("User: ", user);
            console.log("submit: ", shippingAddress);
            console.log("Data: ", data);
          } catch (err){
            console.error("Failed to fetch user", err);
          }
      }

    useEffect(() => {
        getUser();
        const shoppingCart = localStorage.getItem('shoppingCart');

        console.log('Shopping Cart contents: ', shoppingCart);


        if (shoppingCart) {
            setCart(JSON.parse(shoppingCart));
        } else {
            navigate('/shoppingCart');
        }
        
    }, [navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/inventory');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error('Failed to fetch products', err);
            }
        };

        fetchProducts();
    }, []);
    

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => {
            const product = products.find(p => p._id === item.productId);
            return total + (product ? product.price * item.quantity : 0);
        }, 0);
    };

    const calculateTotalQuantity = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const formatCartForPaypal = (shoppingCart) => {
        return shoppingCart.map(item => {
            const product = products.find(p => p._id === item.productId);
            return {
                name: product.name,
                sku: product._id,
                price: product.price,
                currency: "PHP",
                quantity: item.quantity
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const shoppingCart = localStorage.getItem('shoppingCart');
        const userData = JSON.parse(localStorage.getItem('user'));
        const userId = userData.id;
        // error handling
        console.log("Submit order: ", shoppingCart);
        console.log("Submit order - User Data: ", userData);

        let cartParam = formatCartForPaypal(JSON.parse(shoppingCart));
        let total = calculateTotalPrice();

        // const orderItems = JSON.parse(shoppingCart).map(item => {
        //     const product = products.find(p => p._id === item.productId);
        //     return {
        //         productId: item.productId,
        //         quantity: item.quantity,
        //         price: product.price,
        //         name: product.name
        //     };
        // });

        // const orderData = {
        //     items: orderItems,
        //     totalPrice: calculateTotalPrice(),
        //     qty: calculateTotalQuantity(),
        //     date: new Date(),
        //     recipient: user.id,
        //     shippingAddress: shippingAddress,
        //     status: 'Pending'
        // };

        try {
            const res = await fetch('/api/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({cartParam, total, shippingAddress, userId}),
            });

            if (res.ok) {
                const data = await res.json();
                window.location.href = data.url;
            } else {
                console.error('Failed to submit order');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prevAddress => ({
            ...prevAddress,
            [name]: value
        }));
    };

    return (
        <>
        <Navbar />
        <div className="submit-order-container">
            <h1>Submit Order</h1>
            <div className="order-details">
                <div className="shipping-address">
                    <h2>Shipping Address</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Street</label>
                            <input
                                type="text"
                                name="street"
                                value={shippingAddress.street}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={shippingAddress.city}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Province</label>
                            <input
                                type="text"
                                name="province"
                                value={shippingAddress.province}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>ZIP</label>
                            <input
                                type="text"
                                name="zip"
                                value={shippingAddress.zip}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                value={shippingAddress.country}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <button type="submit" className="confirm-button">Confirm Order</button>
                    </form>
                </div>
                <div className="product-summary">
                    <h2>Product Summary</h2>
                    <div className="product-header">
                        <span>Product</span>
                        <span>Quantity</span>
                        <span>Price</span>
                        <span>Total Price</span>
                    </div>
                    <div className="submitorder-list">
                        {cart.map(item => {
                            const product = products.find(p => p._id === item.productId);
                            return (
                                <div key={item.productId} className="submit-product-item">
                                    <span>{product ? product.name : 'Unknown Product'}</span>
                                    <span>{item.quantity}</span>
                                    <span>{product ? `Php ${product.price}` : 'N/A'}</span>
                                    <span>{product ? `Php ${product.price * item.quantity}` : 'N/A'}</span>
                                </div>
                            );
                        })}
                    </div>
                    <h3>Total Quantity: {calculateTotalQuantity()}</h3>
                    <h3>Total Price: {calculateTotalPrice()}</h3>
                </div>
            </div>
        </div>
        </>
    );
}

export default SubmitOrder;
