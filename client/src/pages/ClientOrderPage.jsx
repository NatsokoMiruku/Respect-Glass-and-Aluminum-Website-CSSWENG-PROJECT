import { useEffect, useState } from 'react';
import OrderView from '../components/OrderDiv'; //edited inv name for the put UI
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ShoppingCart from '../components/ShoppingCartButton';
import '../css/OrderPage.css';


function ClientOrderPage() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [arrange, setArrange] = useState(false);
    const [filter, setFilter] = useState("A");
    const [sort, setSorted] = useState("date");

    const [userArray, setUserArray] = useState([]);
    const [itemArray, setItemArray] = useState([]);


    const user = JSON.parse(localStorage.getItem('user'));
    const userid = user.id;

    useEffect(() => {
      getorders();
    }, []);
    
    const toggleSort = () => {
      filteredOrders.reverse();
      setArrange(!arrange);
    }

    const getorders = async() => {
        try{ 
          console.log(userid)
          const res = await fetch(`/api/clientOrders?userId=${userid}`);
          const data = await res.json();
    
            if (Array.isArray(data)){ //remove if does not work
                setOrders(data);
                setFilteredOrders(data); 
            } else {
              console.log("Fetched Inventory is not an array");
            }
          } catch (err){
            console.error("Failed to fetch inventory", err);
          }
      }

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

   

    const handleFilter = (type, type2) => {//assumes all product names are capitalized
      let sorted
      let filtered = type === 'A' ? orders : orders.filter(item => item.status === type);

      setFilter(type)
      setSorted(type2)

      sorted = filtered.sort(function(a,b) {
        if(a[type2] < b[type2]) return -1
        else return 1
      })

      setFilteredOrders(sorted);
    };


    //delete item
    //edit and display items
    

    return (
      <>
      <Navbar/>
      <div className='orders-page'>
      <ShoppingCart/>
      <div className='controls'>
          <button className='toggle-sort' onClick={toggleSort}>
              {arrange ? 'Descending' : 'Ascending'}
          </button>
          <label htmlFor="sort-by" className='label'>Sort by:</label>
          <select name="sort by status" id="sort-by" className='sort-select' onChange={(e) => handleFilter(filter, e.target.value)}>
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="totalPrice">Total Price</option>
              <option value="qty">Quantity</option>
              <option value="recipient">Recipient</option>
          </select>
          <label htmlFor="filter-by" className='label'>Filter by status:</label>
          <select name="filter by status" id="filter-by" className='filter-select' onChange={(e) => handleFilter(e.target.value, sort)}>
              <option value="A">All</option>
              <option value="Pending">Pending</option>
              <option value="In transit">In transit</option>
              <option value="Delivered">Delivered</option>
          </select>
      </div>
      <div className='orders-list'>
          {filteredOrders.map((order) => { 
              return (
                  <div key={order._id} className='order-item'> 
                      <OrderView order={order} userArray={userArray} itemArray={itemArray} isAdmin={false} />
                  </div>
              )
          })}
      </div>
  </div>
  </>
    )
}

export default ClientOrderPage;