
import Navbar from '../components/Navbar'; 
import React, { useEffect, useState, useMemo } from 'react';
import '../css/ProductPage.css';
import { Link } from 'react-router-dom';
import ShoppingCart from '../components/ShoppingCartButton';

// ProductPage Component
const ProductPage = () => {
    const [inventory, setInventory] = useState([]); 
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filteredInventory, setFilteredInventory] = useState([]);

    const getInventory = async() => {
        try{ 
          const res = await fetch("/api/inventory");
          const data = await res.json();
    
            if (Array.isArray(data)){
              setInventory(data);
            //   setFilteredInventory(data); 
            } else {
              console.log("Fetched Inventory is not an array");
            }
          } catch (err){
            console.error("Failed to fetch inventory", err);
          }
      }
  
      const filteredProducts = useMemo(() => {
        return inventory.filter(product => {
          const searchQueryLowerCase = searchQuery.toLowerCase();
          const matchesSearchQuery = product.name.toLowerCase().includes(searchQueryLowerCase);
          const matchesCategory = selectedCategory === 'All' || product.type === selectedCategory;
          return (selectedCategory === 'All' || matchesCategory) && (!searchQuery || matchesSearchQuery);
        });
      }, [inventory, selectedCategory, searchQuery]);
  
      useEffect(() => {
        getInventory();
      },[]);

      useEffect(() => {
        setFilteredInventory(filteredProducts);
      }, [filteredProducts]);
    
    return (

        <>
        <Navbar />
        <ShoppingCart/>
        <div className="product-page">

                <div className="main-content">

                    <div className="row-format">

                             <div className="search-bar">
                                  <input 
                                  type="text"
                                  placeholder="Search products..."
                                  onChange={(e) => setSearchQuery(e.target.value)} 
                                  className="searchtext"/>
                             </div>

                             <div className="search-image">
                              <img src={'images/search1.png'} alt="search" />
                             </div> 
                              <Link to = {`/shoppingCart`}>
                             <div className="cart-image">
                              <img src={'images/cart2.png'} alt="search" />
                             </div>
                             </Link>

                         </div>


                    {/* Category Filter */}
                    <div className="category-filter">
                        {['All', 'Aluminum', 'Glass', 'Frame', 'Bolt'].map((category) => (
                            <button
                                key={category}
                                className={selectedCategory === category ? 'active' : ''}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>


                    {/* Product List */}
                    <div className="product-list">
                        {filteredInventory.map((product) => (
                            <Link to={`/products/${product._id}`} key={product._id} className="product-item">
                                <img className='product-picture' src={product.picture} alt={product.name} />
                                <div className = "prodPageName"><h5>{product.name}</h5></div>
                                <div className = "prodPagePrice"><h5>₱{product.price}</h5></div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div></>
    );
  }
  
  export default ProductPage;