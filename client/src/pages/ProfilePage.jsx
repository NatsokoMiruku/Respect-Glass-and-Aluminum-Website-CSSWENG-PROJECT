import React, { useEffect, useState } from 'react';
import '../css/ProfilePage.css';
import EditProfile from '../components/EditProfile';
import OrderView from '../components/OrderDiv'; //edited inv name for the put UI
import ShoppingCart from '../components/ShoppingCartButton';
import { Link } from 'react-router-dom';

function ProfilePage() {
    const [currUser, setUser] = useState();
    const [orders, setOrders] = useState([]);
    const [userArray, setUserArray] = useState([]);
    const [itemArray, setItemArray] = useState([]);

    const userRaw = JSON.parse(localStorage.getItem("user"))

    const getUser = async () => {
        const res = await fetch("/api/users/" + userRaw.email);
        const data = await res.json();
        setUser(data);
    }
    useEffect(() => {
        getUser();
    }, []);

    const getorders = async() => {
        try{ 
          const res = await fetch("/api/orders");
          const data = await res.json();
    
            if (Array.isArray(data)){ //remove if does not work
                setOrders(data);
            } else {
              console.log("Fetched Inventory is not an array");
            }
          } catch (err){
            console.error("Failed to fetch inventory", err);
          }
    }

    useEffect(() => {
        getorders();
    }, []);

    const getUsers = async() => {
        try{ 
          const res = await fetch("/api/users");
          const data = await res.json();
    
            if (Array.isArray(data)){ //remove if does not work
                setUserArray(data);
            } else {
              console.log("Fetched Inventory is not an array");
            }
          } catch (err){
            console.error("Failed to fetch inventory", err);
          }
    }
  
    useEffect(() => {
        getUsers();
    }, []);
  
    const getItems = async() => {
      try{ 
        const res = await fetch("/api/inventory");
        const data = await res.json();
  
          if (Array.isArray(data)){ //remove if does not work
              setItemArray(data);
          } else {
            console.log("Fetched Inventory is not an array");
          }
      } catch (err){
        console.error("Failed to fetch inventory", err);
      }
    }
  
    useEffect(() => {
        getItems();
    }, []);
    
        //delete items


    const handlePendingFilter = () => {//assumes all product names are capitalized
        let sorted
        let filtered = orders.filter(order => ((order.status === "Pending" || order.status === "In Transit") && order.recipient === userRaw.id));
    
        sorted = filtered.sort(function(a,b) {
            if(a.date < b.date) return -1
            else return 1
        })
    
        return sorted
    };

    const handleCompleteFilter = () => {//assumes all product names are capitalized
        let sorted
        let filtered = orders.filter(order => (order.status === "Delivered" && order.recipient === userRaw.id));
    
        sorted = filtered.sort(function(a,b) {
            if(a.date < b.date) return -1
            else return 1
        })
    
        return sorted
    };

    

    return(
        <>
        <ShoppingCart/>
        <div id='mainDiv'>
        <div id='top'>
            <div id='infoDiv'>
        
                <div id='edit'>
                    <EditProfile currUser={currUser}>edit</EditProfile>
                </div>
                <div id='imagediv'>
                    <img id='pfp' src={currUser && userRaw ? userRaw.picture : ""} alt={currUser ? currUser.name : ""} />
                    <p id="username"> {currUser ? currUser.name : ""} </p>
                    <p id="email"> {currUser ? currUser.email : ""} </p>
                </div>

                <div id='userInfo'>
                    <p id="full name">{currUser ? currUser.fullname : ""}</p>
                    <p id="address"> {currUser && currUser.shippingAddress.street ? currUser.shippingAddress.street + ", " + currUser.shippingAddress.city + ", "+ currUser.shippingAddress.province + ", " +  currUser.shippingAddress.zip + ", " + currUser.shippingAddress.country : ""} </p>

                    <div id='orders'>
                        <h3 id='orderNumber'>{handleCompleteFilter().length}</h3>    
                        <p id="orderLabel">Orders completed</p> 
                    </div>
                </div>
            </div>

            <div id='OrdersDiv'>

                <div id = "OngoingOrders"> Pending orders
                    <div className='shrinker'>
                        {handlePendingFilter().map((order) => { 
                            return (
                                <div key={order._id} className='order-item'> 
                                    <OrderView order={order} userArray={userArray} itemArray={itemArray} isAdmin={false}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div id ='OrderHistory'>Order History
                    <div className='shrinker'>
                        {handleCompleteFilter().map((order) => { 
                            return (
                                <div key={order._id} className='order-item'> 
                                    <OrderView order={order} userArray={userArray} itemArray={itemArray} isAdmin={false}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
                
            </div>
        </div>
        <div id='editValues'>
            
        </div>

        </div>
        </>
    );
}
export default ProfilePage;