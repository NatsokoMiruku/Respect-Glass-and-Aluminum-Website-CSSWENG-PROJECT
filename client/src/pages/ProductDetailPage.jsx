import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ShoppingCart from '../components/ShoppingCartButton';
import '../css/ProductDetail.css';

function ProductDetail() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/inventory/" + id);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Log the data to see its structure
        console.log('Product Data:', data);
        
        if (data && data.remaining !== undefined) {
          setProduct(data);
        } else {
          console.error('Product data is missing or invalid.');
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (productId, quantity) => {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const productIndex = cart.findIndex(item => item.productId === productId);
    
    const currentQuantityInCart = productIndex >= 0 ? cart[productIndex].quantity : 0;
    
    if (currentQuantityInCart + quantity > product.remaining) {
      alert('You cannot add more than the available stock.');
      return;
    }
  
    if (productIndex >= 0) {
      cart[productIndex].quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }
  
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    console.log('Shopping Cart:', localStorage.getItem('shoppingCart'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product) {
      handleAddToCart(product._id, quantity);
      setProduct(prevProduct => ({
        ...prevProduct,
        remaining: prevProduct.remaining - quantity
      }));
    }
  };

  const handleAdd = () => {
    if (quantity < (product ? product.remaining : 1)) {
      setQuantity(quantity + 1);
    }
  };

  const handleSub = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <Navbar />
      <ShoppingCart/>
      <div className="product-detail-container">
        <div className="product-image-container">
          {/* Placeholder for product image */}
          <img src={product.picture} alt={product.name} className="product-image" />
        </div>
        <div className="product-details">
          <h3 className="product-name">{product.name}</h3>
          <h3 className="product-price">P {product.price}</h3>
          <h3 className="product-type">{product.type}</h3>
          {isLoggedIn ? (
          <form className="product-quantity" onSubmit={handleSubmit}>
            <div className='absolutegamerdiv'>
              <button className="button1" type="button" onClick={handleSub}>-</button>
              <p className="quantity-display">{quantity}</p>
              <button className="button2" type="button" onClick={handleAdd}>+</button>
            </div>
            <p className="quantity-left"> {product.remaining} remaining </p>
            <button className="add-to-cart" type="submit">Add to cart</button>
          </form>
          ) : (
            <h1>You must be logged in to buy products</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
